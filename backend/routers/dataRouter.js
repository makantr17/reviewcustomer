import express from 'express'
import Collection from '../models/dataCollectionModel'
import File from '../models/file'
const fs = require('fs')
// import { isAuth } from '../util';
// const path = require('path');
const multer = require('multer');

const router = express.Router();



// upload file in the storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'shop-fish/public/images');
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



// routers goes here
router.post("/", async (req, res)=>{
    const datacollection = new Collection({
        dataCategory: {
            name: req.body.name,
            category: req.body.category,
            size: req.body.size,
            price: req.body.price,
            format: req.body.format,
            description: req.body.description
        }
    });
    const newCollection= await datacollection.save();
    if (newCollection) {
        return res.status(201).send({message: "New data collection successfully created", data: newCollection})
    }else{
        return res.status(500).send({message: "Failed to create Collection"})
    }
})



router.get("/", async (req, res) =>{
    const collections = await Collection.find({});
    res.send(collections);
});



// router.put("/:id", async (req, res)=>{
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//         product.productCategory.name= req.body.name;
//         product.productCategory.price= req.body.price;
//         product.productCategory.image= req.body.image;
//         product.productCategory.brand= req.body.brand;
//         product.productCategory.category= req.body.category;
//         product.productCategory.reduction= req.body.reduction;
//         product.productCategory.description= req.body.description;
        
//         if (req.body.type) {
//             product.productTypes.forEach(element => {
//                 if (element._id == req.body.idType) {
//                     element.type = req.body.type;
//                     element.size = req.body.size;
//                     element.image = req.body.imageType;
//                     element.priceByKilo = req.body.priceByKilo;
//                     element.priceByPackage = req.body.priceByPackage;
//                     element.countKiloInStock = req.body.countKiloInStock;
//                     element.countPackageInStock = req.body.countPackageInStock; 
//                     element.priceByUnity =req.body.priceByUnity;
//                     element.countUnityInStock = req.body.countUnityInStock;
//                     element.rouleau = req.body.rouleau;
//                     element.countRouleau = req.body.countRouleau;
//                     element.color = req.body.color;
//                     element.details = req.body.details;
//                     element.reductionOn = req.body.reductionOn;
//                 }
//             });
//         }
//         const updateProduct = await product.save();
//         if (updateProduct) {
//              return res.status(200).send({massage: "Product Updated", data: updateProduct})
//         }
//     }
//     return res.status(500).send({message: "Error Updating the Product"});
// });


// router.put("/access/:id", async (req, res)=>{
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//         product.accessAllowedProduct.delete= req.body.accessAllowedProduct.productAccessDelete;
//         product.accessAllowedProduct.edit= req.body.accessAllowedProduct.productAccessEdit;
//         product.accessAllowedProduct.publish= req.body.accessAllowedProduct.productAccessPublish;

//         const updateProduct = await product.save();
//         if (updateProduct) {
//              return res.status(200).send({massage: "Product Access Updated", data: updateProduct})
//         }
//     }
//     return res.status(500).send({message: "Error Updating the Product Access"});
// });




// router.put("/promo/:id", async (req, res)=>{
//    const datalist= await Product.find({'_id' : req.body.promotorList}, function(err, products){ 
//         if (err) {
//             res.send(err);
//         } else {
//             products.forEach(product => {
//                 product.promotion= req.body.productPromotions;
//                 product.startTime= req.body.promoStartTime;
//                 product.deadline= req.body.promoDeadline;
//                 product.save()
//              });
//             console.log(products);
//         }
        
//     });
//     if (datalist) {
//         return res.status(200).send({massage: "Product Access Updated", data: datalist})
//     }
// });


router.delete("/:id", async (req, res) =>{
    const deleteCollections = Collection.findById(req.params.id);
    if (deleteCollections) {
        await deleteCollections.remove();
        res.send({message: "Collection Deleted"});
    }else{
        res.send({message: "Error Deleting the Collection"});
    }
});


router.get("/:id", async (req, res) =>{
    const collection = await Collection.findOne({_id: req.params.id});
    if (collection) {
        res.send([collection])
    }else{
        res.status(404).send({message:"Collection not found"})
    }
});



export default router;



