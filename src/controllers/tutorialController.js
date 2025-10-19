import Tutorial from '../models/tutorialModel.js';

// Create tutorial
export const createTutorial = async (req, res) => {
  try {
    const { title, videoUrl, description } = req.body;
    const newTutorial = await Tutorial.create({ title, videoUrl, description });
    res
      .status(201)
      .json({ message: 'Tutorial added successfully!', status: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tutorials
export const getAllTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 });
    res.status(200).json(tutorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single tutorial by ID
export const getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial)
      return res.status(404).json({ message: 'Tutorial not found' });
    res.status(200).json(tutorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tutorial
export const updateTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, videoUrl, description } = req.body;

    const updatedTutorial = await Tutorial.findByIdAndUpdate(
      id,
      { title, videoUrl, description },
      { new: true, runValidators: true }
    );

    if (!updatedTutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.status(200).json({
      message: 'Tutorial updated successfully',
      data: updatedTutorial,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tutorial
export const deleteTutorial = async (req, res) => {
  try {
    const deleted = await Tutorial.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Tutorial not found' });
    res.status(200).json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
