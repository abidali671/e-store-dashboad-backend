import CategoryModal from "../model/Category.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Get Categories Api Controller
async function getCategories(_, res) {
  try {
    const categories = await CategoryModal.find();

    if (categories)
      res.status(200).send(
        categories.map(({ name, slug, description, _id }) => ({
          id: _id,
          name,
          slug,
          description,
        }))
      );
    else throw { error: "No category is created." };
  } catch (error) {
    res.status(404).send(ErrorHandler(error));
  }
}

// Register API Controller
export async function createCategory(req, res) {
  try {
    const { name, slug, description } = req.body;

    const category = new CategoryModal({
      name,
      slug,
      description,
    });

    await category.validate();
    await category.save();

    res.status(201).send({
      id: category._id,
      name,
      slug,
      description,
    });
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

export default { getCategories, createCategory };
