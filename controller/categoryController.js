import CategoryModal from "../model/Category.model.js";
import CategorySchema from "../schema/category.schema.js";
import Config from "../utils/Config.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Get Categories Api Controller
async function getCategories(_, res) {
  try {
    const categories = await CategoryModal.find();

    if (categories)
      res.status(200).send(
        categories.map(({ name, slug, description, thumbnail, _id }) => ({
          id: _id,
          name,
          slug,
          thumbnail,
          description,
        }))
      );
    else throw { error: "No category is created." };
  } catch (error) {
    res.status(404).send(ErrorHandler(error));
  }
}

// Create Category API Controller
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

// Create Category API Controller
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, slug, thumbnail } = await CategoryModal.findOne({
      _id: id,
    });

    const updatedCategory = { name, description, slug, thumbnail, ...req.body };

    await CategorySchema.validate(updatedCategory, {
      strict: true,
      abortEarly: false,
    });

    await CategoryModal.updateOne({ _id: id }, updatedCategory);

    res.status(201).send(req.body);
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

async function updateCategoryThumbnail(req, res) {
  try {
    const { destination, filename } = req.file;
    const { id } = req.params;

    const thumbnail_url =
      destination.replace(".", Config.BASE_URL) + "/" + filename;

    await CategoryModal.updateOne({ _id: id }, { thumbnail: thumbnail_url });

    res.status(201).send({ url: thumbnail_url });
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  updateCategoryThumbnail,
};
