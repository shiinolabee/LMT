/**
 * DepartmentService
 *
 * @description :: Server-side logic for managing departments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Services
 */

module.exports = {
    
    getDepartmentList : function( next ) {

        // departments.find().paginate({ page : pageValue , limit : limitValue}).exec(function( err, departments ) {
        Departments.find().exec(function( err, departments ) {

            if( err ) throw err;

            next(departments);
        });

    },
    
    getDepartment : function( criteria, next ) {

        Departments.find({ where : { departmentName : criteria, departmentCode : criteria } }).exec(function( err, departments ) {

            if( err ) throw err;

            next(departments);
        });

    },

    saveDepartment : function ( data, next ) {

        Departments.create( data ).exec(function( err, department ){
            if( err ) throw err;

            next(department);
        });
    },

    updateDepartment : function ( data, id, next ) {

        Departments.update( { id : id }, data ).exec(function( err, department ){
            if( err ) throw err;

            next(department);
        });
    },

    removeDepartment : function( id, next) {

        Departments.destroy( { id : id } ).exec(function( err, department ){
            if( err ) throw err;

            next(department);
        });
    }
};