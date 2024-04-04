const express = require('express');
const router = express.Router();
const Company = require('../models/Company');


//POST method to list the companies in Database
router.post('/',async(req,res)=>{
    try{
        const data = req.body;
        const newCompany = await Company.create(data);
        console.log("Company Added Successfully!");
        res.status(200).json(newCompany);
    }catch(error){
        console.log(error);
        res.status(500).json({error:'Internal Server Error'})
    }
});

//GET method to retrieve all Companies 
router.get('/',async(req,res)=>{
    try{
        const companies = await Company.findAll();
        res.status(200).json(companies);
    } catch(error){
        console.log(error);
        res.status(500).json({error:'Internal Sever Error'})
    }
});

//PUT method to update the Company information 
router.put('/:companyId', async(req,res)=>{
    try {
        const companyId = req.params.companyId;
        //Update company in the database
        await Company.update(req.body,{
            where: {id:companyId}
        });
        //fetch the updated company from database
        const updatedCompany = await Company.findOne({
            where:{id:companyId}
        });
        if(!updatedCompany){
            return res.status(404).json({error:'Company not found!'});
        }
        res.status(200).json({message:'Updated Successfully',updatedCompany});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Sever Error'}) 
    }

});

//DELETE method to delete the Company Data 
router.delete('/:companyId', async(req,res)=>{
    try {
        const companyId = req.params.companyId;
        const deleteCompany = await Company.findOne({
            where:{id:companyId}
        });
        if(!deleteCompany){
            return res.status(404).json({error:'Company not found'});
        }

        //Delete Company from Database
        await Company.destroy({
            where:{id:companyId}
        });
        res.status(200).json({message:'Company Deleted Successfuly'})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Sever Error'}) 
    }
})

//GET method to retrive all companies by filter 
router.get('/status',async(req,res)=>{
    try {
        const {status} = req.query;

        console.log("status==>>" , status)
        let companies;
        
        if(status){
            companies =await Company.findAll({
                where:{companyStatus:status}
            });
            res.status(200).json({message: 'Companies retrived Succesfully',companies});
        }else{
            companies = await Company.findAll();
            res.status(200).json({message:' All Companies Retrived Sucessfully', companies })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal Sever Error'});
    }
})


//Pegination for Displaying Data
router.get('/pegination',async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    console.log("page==>",page)
    const perPage = 3;

    try {
        //Count total number of companies
        const totalCompanies = await Company.count();

        //Calculate total Pages
        const totalPages = Math.ceil(totalCompanies/perPage);

        //Feth companies for the requestd page
        const companies = await Company.findAll({
            limit:perPage,
            offset:(page - 1)*perPage
        });
        res.status(200).json({companies,totalPages,page});
    } catch (error) {
        console.error('Error Fetching Companies:',error);
        res.status(500).json({error:'Internal Server Error'})
    }
})


// router.post('/search', async(req,res)=>{
//     const {query} = req.body;
//     try {
//         const filter = {
//             $or:[
//                 {name:{regex:query,$options:'i'}},
//                 {email:{regex:query,$options:'i'}},
//             ]
//         }
//         const filterData = await this.search.findAll(filter);
//         if(filterData===0){
//             return res.status(404).json({message:'message not found'})
//         }
//             return res.status(200).json(filterData)
//     } catch (error) {
//         console.error('Error Fetching Companies:',error);
//         res.status(500).json({error:'Internal Server Error'})
//     }

// })

module.exports = router;