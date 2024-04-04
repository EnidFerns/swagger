const express = require('express');
const router = express.Router();
const Company = require('../models/Company');


/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: API endpoints for managing companies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         companyName:
 *           type: string
 *           example: Example Company
 *         contactName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         phone:
 *           type: string
 *           example: 1234567890
 *         address:
 *           type: string
 *           example: 123 Main St
 *         city:
 *           type: string
 *           example: New York
 *         state:
 *           type: string
 *           example: NY
 *         zipCode:
 *           type: integer
 *           example: 10001
 *         website:
 *           type: string
 *           format: url
 *           example: http://www.example.com
 *         companyStatus:
 *           type: string
 *           enum: [Active, Inactive]
 *           example: Active
 *       required:
 *         - companyName
 *         - contactName
 *         - email
 *         - phone
 *         - address
 *         - city
 *         - state
 *         - zipCode
 *         - companyStatus
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Add a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: New company added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       500:
 *         description: Internal Server Error
 */


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



/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Retrieve all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *       500:
 *         description: Internal Server Error
 */

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



/**
 * @swagger
 * /companies/{companyId}:
 *   put:
 *     summary: Update a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the company to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal Server Error
 */


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


/**
 * @swagger
 * /companies/{companyId}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the company to delete
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal Server Error
 */

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

/**
 * @swagger
 * /companies/status:
 *   get:
 *     summary: Retrieve companies by status
 *     tags: [Companies]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Status of the companies (Active or Inactive)
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 *       500:
 *         description: Internal Server Error
 */

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



module.exports = router;