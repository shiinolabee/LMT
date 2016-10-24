/**
 * DepartmentService
 *
 * @description :: Server-side logic for managing departments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getDepartmentList : function( callback ) {
        
        Departments.find().populate('employees').exec(function( err, departments ) {

            if( err ) throw err;

            sails.log('There are %d department(s) fetched in the collection.', departments.length);


            callback(departments);
        });

    },

    getSortingList : function( sortData, callback ){

        Departments.find({ sort : sortData.orderBy + ' ' + sortData.orderType }).exec(function( err, departments ) {        

            if( err ) callback(err);

            sails.log('Sorted data list successfully fetched in the collection.');


            callback(departments);
        });
    },
    
    getDepartment : function( criteria, next ) {

        Departments.find({ where : { departmentName : criteria, departmentCode : criteria } }).exec(function( err, departments ) {

            if( err ) throw err;

            sails.log('Searched department(s) successfully fetched in the collection.');

            next(departments);
        });

    },

    saveDepartment : function ( data, callback ) {

        Departments.create( data ).exec(function( err, department ){
            if( err ) throw err;

            sails.log('Department details successfully saved in the collection.');

            callback(department);
        });
    },

    updateDepartment : function ( data, id, callback ) {

        Departments.update( { id : id }, data ).exec(function( err, department ){
            if( err ) throw err;

            sails.log('Department details successfully updated in the collection.');

            callback(department);
        });
    },

    removeDepartment : function( id, callback) {

        Departments.destroy( { id : id } ).exec(function( err, department ){
            if( err ) throw err;

            sails.log('Department details successfully removed in the collection.');

            callback(department);
        });
    }
};