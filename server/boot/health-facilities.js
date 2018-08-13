module.exports = function(app) {
    var InternalUser = app.models.InternalUser;
    var HealthFacilityCategory = app.models.HealthFacilityCategory;
    var HealthFacility = app.models.HealthFacility;
 
    ['Clinic', 'Health Facility', 'Pharmacy' ,'Hospital'].forEach(function(category){
        HealthFacilityCategory.findOrCreate({
            name: category
        }, function(healthFacilityCategory, err){
            if(err) return;
            HealthFacility.findOrCreate({
                name: 'Sample' + category,
                categoryId: healthFacilityCategory.id
            }, function(err, healthFacility) {
                console.log(err, healthFacility);
            });
        });

    });
    // InternalUser.find(function(err, users) {
    //     console.log(users, 'USERS');
    // });

}