const db = require('../models')
const User = db.user
const Place = db.Place
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Reservation = db.Reservation
const { JWT_SECRET } = process.env

const userSignup = async (req, res) => {
  try {
    const { username, password, email } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: "Please fill all the fields" })
    }
    const user = await User.findOne({ where: { username } })
    if (user) {
      return res.status(400).json({ error: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({ username, email, password: hashedPassword, role: "user" })
    res.status(200).json({ status: "User created successfully", status_code: 200, user_id: newUser.id })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal server error" })
  }
}

const userLogin = async (req, res) => {
  // console.log(JWT_SECRET)
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "Incorrect username/password provided. Please retry", status_code: 401 });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ status: "login successful", status_code: 200, user_id: user.id, access_token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const searchPlacesByName = async (req, res) => {
  try {
    const { name } = req.query;
    // console.log(name)
    if (!name) {
      return res.status(400).json({ error: "Please provide a name to search" });
    }

    const places = await Place.findAll({
      where: {
        name: {
          [db.Sequelize.Op.like]: `%${name}%`
        }
      }
    });

    res.status(200).json({ results: places });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPlaceAvailability = async (req, res) => {
  try {
    const { place_id, start_time, end_time } = req.query;

    if (!place_id || !start_time || !end_time) {
      return res.status(400).json({ error: "Please provide place_id, start_time, and end_time" });
    }

    const place = await Place.findByPk(place_id);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    const booked_slots = place.booked_slots;
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    const isAvailable = booked_slots.every(slot => {
      const slotStartTime = new Date(slot.start_time);
      const slotEndTime = new Date(slot.end_time);
      return endTime <= slotStartTime || startTime >= slotEndTime;
    });

    if (isAvailable) {
      return res.status(200).json({
        place_id: place.id,
        name: place.name,
        address: place.address,
        phone_no: place.phone_no,
        website: place.website,
        operational_hours: place.operational_hours,
        booked_slots: place.booked_slots,
        available: true,
        next_available_slot: null
      });
    } else {
      let nextAvailableSlot = endTime;
      while (true) {
        const isSlotFree = booked_slots.every(slot => {
          const slotStartTime = new Date(slot.start_time);
          const slotEndTime = new Date(slot.end_time);
          return nextAvailableSlot <= slotStartTime || (new Date(nextAvailableSlot.getTime() + (endTime - startTime))) <= slotStartTime;
        });

        if (isSlotFree) {
          break;
        }

        nextAvailableSlot = new Date(nextAvailableSlot.getTime() + 1 * 60 * 60 * 1000); // Increment by 1 hour
      }

      return res.status(200).json({
        place_id: place.id,
        name: place.name,
        address: place.address,
        phone_no: place.phone_no,
        website: place.website,
        operational_hours: place.operational_hours,
        booked_slots: place.booked_slots,
        available: false,
        next_available_slot: nextAvailableSlot.toISOString()
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const bookPlace = async (req, res) => {
  try {
    const { place_id, start_time, end_time } = req.body;

    if (!place_id || !start_time || !end_time) {
      return res.status(400).json({ error: "Please provide place_id, start_time, and end_time" });
    }

    // Verify user token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const place = await Place.findByPk(place_id);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    const booked_slots = place.booked_slots;
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Ensure the end time is after the start time
    if (endTime <= startTime) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    // Check if the slot is available
    const isAvailable = booked_slots.every(slot => {
      const slotStartTime = new Date(slot.start_time);
      const slotEndTime = new Date(slot.end_time);
      return endTime <= slotStartTime || startTime >= slotEndTime;
    });

    if (isAvailable) {
      const newSlot = { start_time, end_time };
      booked_slots.push(newSlot);

      await Place.update({ booked_slots }, { where: { id: place_id } });

      const newReservation = await Reservation.create({
        userId,
        placeId: place_id,
        startTime:start_time,
        endTime:end_time
      });

      return res.status(200).json({
        status: "Slot booked successfully",
        status_code: 200,
        booking_id: newReservation.id
      });
    } else {
      return res.status(400).json({
        status: "Slot is not available at this moment, please try some other place",
        status_code: 400
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { userSignup, userLogin, searchPlacesByName, getPlaceAvailability,bookPlace }