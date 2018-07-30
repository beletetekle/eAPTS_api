module.exports = function(app) {
    var InternalUser = app.models.InternalUser;
    var HealthCenterCategory = app.models.HealthCenterCategory;
    var HealthCenter = app.models.HealthCenter;
 
    ['Clinic', 'Health Center', 'Pharmacy' ,'Hospital'].forEach(function(category){
        HealthCenterCategory.findOrCreate({
            name: category
        }, function(healthCenterCategory){
            HealthCenter.findOrCreate({
                name: 'Sample' + category,
                categoryId: healthCenterCategory.id
            }, function(err, healthCenter) {
                console.log(err, healthCenter);
            });
        });

    });
    // InternalUser.find(function(err, users) {
    //     console.log(users, 'USERS');
    // });

}