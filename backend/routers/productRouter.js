import express from 'express'
import Product from '../models/productModel'
import File from '../models/file'
const fs = require('fs')
// import { isAuth } from '../util';
// const path = require('path');
const multer = require('multer');

const router = express.Router();

// online codes
// const upload = multer({
//     storage: multer.diskStorage({
//       destination(req, file, cb) {
//         cb(null, './files');
//       },
//       filename(req, file, cb) {
//         cb(null, `${new Date().getTime()}_${file.originalname}`);
//       }
//     }),
//     limits: {
//       fileSize: 1000000 // max file size 1MB = 1000000 bytes
//     },
//     fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
//         return cb(
//           new Error(
//             'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
//           )
//         );
//       }
//       cb(undefined, true); // continue with upload
//     }
//   });

// upload file in the storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'frontend/public/images');
    },
    filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-')   + file.originalname);
    }
});
const fileFilter = (req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }else{
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits:{
    fileSize: 1024 * 1024 * 5000},
    fileFilter: fileFilter
});



router.post('/deleteImage', async (req, res) => {
    try{
        const prevPath = req.body.image_path;
        if (prevPath) {
            fs.unlink(prevPath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }else{
                    res.status(200).send("Image deleted successfuly")
                }
            })
        }
    }
    catch(eror){
        res.status(200).send({massage: "Error while deleting the path"})
    }
})

// post file in db and upload folder
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const {prevPath, typeSubmitted} = req.body;
        const {path, mimetype } = req.file;
        const file = new File({
            prevPath,
            typeSubmitted,
            file_path: path,
            file_mimetype: mimetype
        });
        if (file) {
            res.status(200).send({message: "Image added successfuly", data: file})
        }
       
    }catch (error) {
        res.status(400).send({error:'Error while uploading file. Try again later.'});
      }
    },
    (error, req, res, next) => {
      if (error) {
        res.status(500).send("error coming here");
      }
    }
);

//   
// Router.get('/getAllFiles', async (req, res) => {
//     try {
//       const files = await File.find({});
//       const sortedByCreationDate = files.sort(
//         (a, b) => b.createdAt - a.createdAt
//       );
//       res.send(sortedByCreationDate);
//     } catch (error) {
//       res.status(400).send('Error while getting list of files. Try again later.');
//     }
//   });
  

//   Router.get('/download/:id', async (req, res) => {
//     try {
//       const file = await File.findById(req.params.id);
//       res.set({
//         'Content-Type': file.file_mimetype
//       });
//       res.sendFile(path.join(__dirname, '..', file.file_path));
//     } catch (error) {
//       res.status(400).send('Error while downloading file. Try again later.');
//     }
//   });


// routers goes here
router.post("/", upload.single('image'), async (req, res)=>{
    const product = new Product({
        productCategory: {
            name: req.body.productCategory.name,
            category: req.body.productCategory.category,
            image:req.body.productCategory.imagePath,
            price: req.body.productCategory.price,
            brand: req.body.productCategory.brand,
            description: req.body.productCategory.description,
            reduction: req.body.productCategory.reduction
        },
        productTypes: req.body.productTypes  
    });
    const newProduct = await product.save();
    if (newProduct) {
        return res.status(201).send({message: "New product successfully created", data: newProduct})
    }else{
        return res.status(500).send({message: "Failed to create product"})
    }
})



router.get("/", async (req, res) =>{
    const products = await Product.find({});
    res.send(products);
});

router.get("/category", async (req, res) =>{
    const products = await Product.find({});
    const product= []
    products.forEach(element => {
        product.push(element.productCategory.category)
    });
    res.send(product);
});



router.put("/:id", async (req, res)=>{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.productCategory.name= req.body.name;
        product.productCategory.price= req.body.price;
        product.productCategory.image= req.body.image;
        product.productCategory.brand= req.body.brand;
        product.productCategory.category= req.body.category;
        product.productCategory.reduction= req.body.reduction;
        product.productCategory.description= req.body.description;
        
        if (req.body.type) {
            product.productTypes.forEach(element => {
                if (element._id == req.body.idType) {
                    element.type = req.body.type;
                    element.size = req.body.size;
                    element.image = req.body.imageType;
                    element.priceByKilo = req.body.priceByKilo;
                    element.priceByPackage = req.body.priceByPackage;
                    element.countKiloInStock = req.body.countKiloInStock;
                    element.countPackageInStock = req.body.countPackageInStock; 
                    element.priceByUnity =req.body.priceByUnity;
                    element.countUnityInStock = req.body.countUnityInStock;
                    element.rouleau = req.body.rouleau;
                    element.countRouleau = req.body.countRouleau;
                    element.color = req.body.color;
                    element.details = req.body.details;
                    element.reductionOn = req.body.reductionOn;
                }
            });
        }
        const updateProduct = await product.save();
        if (updateProduct) {
             return res.status(200).send({massage: "Product Updated", data: updateProduct})
        }
    }
    return res.status(500).send({message: "Error Updating the Product"});
});


router.put("/access/:id", async (req, res)=>{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.accessAllowedProduct.delete= req.body.accessAllowedProduct.productAccessDelete;
        product.accessAllowedProduct.edit= req.body.accessAllowedProduct.productAccessEdit;
        product.accessAllowedProduct.publish= req.body.accessAllowedProduct.productAccessPublish;

        const updateProduct = await product.save();
        if (updateProduct) {
             return res.status(200).send({massage: "Product Access Updated", data: updateProduct})
        }
    }
    return res.status(500).send({message: "Error Updating the Product Access"});
});




router.put("/promo/:id", async (req, res)=>{
   const datalist= await Product.find({'_id' : req.body.promotorList}, function(err, products){ 
        if (err) {
            res.send(err);
        } else {
            products.forEach(product => {
                product.promotion= req.body.productPromotions;
                product.startTime= req.body.promoStartTime;
                product.deadline= req.body.promoDeadline;
                product.save()
             });
            console.log(products);
        }
        
    });
    if (datalist) {
        return res.status(200).send({massage: "Product Access Updated", data: datalist})
    }


});


router.delete("/:id", async (req, res) =>{
    const deleteProduct = Product.findById(req.params.id);
    if (deleteProduct) {
        await deleteProduct.remove();
        res.send({message: "Product Deleted"});
    }else{
        res.send({message: "Error Deleting the Product"});
    }
});


router.get("/:id", async (req, res) =>{
    const products = await Product.findOne({_id: req.params.id});
    if (products) {
        res.send([products])
    }else{
        res.status(404).send({message:"Product not found"})
    }
});



export default router;
















// router.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//       const { title, description } = req.body;
//       const { path, mimetype } = req.file;
//       const file = new File({
//         title: title,
//         description: description,
//         file_path: path,
//         file_mimetype: mimetype
//       });
//       const succeded =await file.save();

//       // const data = 'test'
//       if (succeded) {
//         // res.send('file uploaded successfully.');
//         res.status(200).send({massage: "Image added successfuly", data: succeded})
//       }
     
//     } catch (error) {
//       res.status(400).send('Error while uploading file. Try again later.');
//     }
//   },
//   (error, req, res, next) => {
//     if (error) {
//       res.status(500).send("error coming here");
//     }
//   }
// );