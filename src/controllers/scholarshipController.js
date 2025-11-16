import Scholarship from '../models/Scholarship.js';

// Create Scholarship
export const createScholarship = async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    const saved = await scholarship.save();
    res.status(201).json({
      success: true,
      message: 'Scholarship created successfully!',
      data: saved,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Scholarships (with filters + sorting + pagination)
export const getAllScholarships = async (req, res) => {
  try {
    const { level, country, major, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (level) filter.level = { $regex: new RegExp(`^${level}$`, 'i') };
    if (country) filter.country = { $regex: new RegExp(`^${country}$`, 'i') };
    if (major)
      filter.majors = { $elemMatch: { $regex: new RegExp(major, 'i') } };

    const skip = (page - 1) * limit;

    const today = new Date();

    const scholarships = await Scholarship.aggregate([
      { $match: filter },

      //  Convert string deadline → real date
      {
        $addFields: {
          deadlineDate: { $toDate: '$applicationDeadline' },
        },
      },

      //  Mark expired items
      {
        $addFields: {
          isExpired: { $lt: ['$deadlineDate', today] },
        },
      },

      //  Sort: upcoming → expired → earliest first
      {
        $sort: {
          isExpired: 1, // upcoming first
          deadlineDate: 1, // earliest date first
        },
      },

      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const total = await Scholarship.countDocuments(filter);

    res.status(200).json({
      data: scholarships,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Scholarship by ID
export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Scholarship
export const updateScholarship = async (req, res) => {
  try {
    const updated = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({
      success: true,
      message: 'Scholarship updated successfully!',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Scholarship
export const deleteScholarship = async (req, res) => {
  try {
    const deleted = await Scholarship.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
