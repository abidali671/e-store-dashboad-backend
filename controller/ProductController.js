import { v2 as cloudinary } from "cloudinary";
import { ProductModel } from "../model/index.js";
import { CleanObject, ErrorHandler } from "../utils/index.js";
import ProductSchema from "../schema/product.schema.js";

async function getProducts(_, res) {
  try {
    const products = await ProductModel.find().populate("category").lean();

    res.status(200).send(
      products.map((product) => ({
        ...CleanObject(product),
        category: CleanObject(product.category),
      }))
    );
  } catch (error) {
    res.status(404).send(ErrorHandler(error));
  }
}

async function getProduct(req, res) {
  try {
    const { slug } = req.params;

    const product = await ProductModel.findOne({ slug })
      .populate("category")
      .lean();

    res.status(200).send({
      ...CleanObject(product),
      category: CleanObject(product.category),
    });
  } catch (error) {
    res.status(404).send(ErrorHandler(error));
  }
}

async function deleteProduct(req, res) {
  try {
    const { slug } = req.params;

    await ProductModel.deleteOne({ slug });

    res.status(200).send({
      msg: "Product deleted successfully",
    });
  } catch (error) {
    res.status(404).send(ErrorHandler(error));
  }
}

async function createProduct(req, res) {
  try {
    const { name, slug, description, short_description, tags, category } =
      req.body;

    const product = new ProductModel({
      name,
      slug,
      description,
      short_description,
      tags,
      category,
    });

    await product.validate();
    await product.save();

    const newProduct = await ProductModel.findOne({ _id: product._id })
      .populate("category")
      .lean();

    res.status(201).send({
      ...CleanObject(newProduct),
      category: CleanObject(newProduct.category),
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send(ErrorHandler(error));
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { _id, ...productDetail } = await ProductModel.findOne({
      _id: id,
    }).lean();

    const { id: ID, ...updatedProduct } = {
      ...CleanObject(productDetail),
      ...req.body,
    };

    await ProductSchema.validate(updatedProduct, {
      strict: true,
      abortEarly: false,
    });

    await ProductModel.updateOne({ _id }, updatedProduct);

    res.status(201).send({ msg: "Product updated successfully" });
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

// async function updateCategoryThumbnail(req, res) {
//   try {
//     const { id } = req.params;

//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

//     const response = await cloudinary.uploader.upload(dataURI, {
//       resource_type: "auto",
//     });

//     await CategoryModal.updateOne({ _id: id }, { thumbnail: response.url });

//     res.status(201).send({ url: response.url });
//   } catch (error) {
//     res.status(500).send(ErrorHandler(error));
//   }
// }

export default {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};
