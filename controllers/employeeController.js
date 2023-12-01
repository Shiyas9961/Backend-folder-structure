const Employee = require('../model/Employee')

const getAllEmployees = async (req, res) => {
    try{
        const employees = await Employee.find({}).exec()
        if(!employees?.length){
            return res.json({message : "Users not found"})
        }
        res.status(200).json(employees)
    }catch(err){
        res.status(400).json({message : err.message})
    }
}

const createNewEmployee = async (req, res) => {
    const {firstname, lastname} = req.body

    if (!firstname || !lastname) {
        return res.status(400).json({ 'message': 'First and last names are required.' });
    }
    try{
        await Employee.create({firstname,lastname})
        res.status(201).json({message : `Employee ${firstname} Created Successfully`});
    }catch(err){
        res.status(400).json({message : err.message})
    }

}

const updateEmployee = async (req, res) => {
    const {id, firstname, lastname} = req.body
    if (!id) {
        return res.status(400).json({ 'message': 'ID is required.' });
    }
    try{
        const foundEmp = await Employee.findOne({_id : id}).exec()

        if(!foundEmp){
            return res.status(400).json({message : "Emplee did'nt exist"})
        }

        await foundEmp.updateOne({firstname, lastname})

        foundEmp.save()

        res.status(201).json({message : `Employee ${firstname} Updated`});

    }catch(err){
        res.status(400).json({message : err.message})
    }
}

const deleteEmployee = async (req, res) => {
    const { id } = req.body
    if(!id){
        return res.status(400).json({message : "ID required"})
    }
    try{

        const result = await Employee.findOneAndDelete({_id : id})

        res.status(200).json({message : `Employee ${result.firstname} deleted`})

    }catch(err){
        res.status(400).json({message : err.message})
    }
}

const getEmployee = async (req, res) => {
    const { id } = req.params
    try{
        const employee = await Employee.findOne({_id : id}).exec()

        if (!employee) {
            return res.status(400).json({ "message": `Employee ID ${id} not found` });
        }
        
        res.status(200).json(employee)
    }catch(err){
        res.status(400).json({message : err.message}) 
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}