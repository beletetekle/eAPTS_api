


module.exports = function(app) {
    var User = app.models.User;
    var InternalUser = app.models.InternalUser;
    var Patient = app.models.Patient;

    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    var Region = app.models.Region;
    var Zone = app.models.Zone;
    var Woreda = app.models.Woreda;
    var HealthFacility = app.models.HealthFacility;


    
    Role
      .findOrCreate({name: 'super-admin'}, function(err, role) {
        var superAdminRole = role;
        if (!err){
          InternalUser.findOrCreate({
          username: "root",
          email: "root@hmis-eth.com",
          password: "root"
        }, function(err, user){
          // Add a super admin role to this user
          if (!err){
            RoleMapping.create({
              principalId: user.id,
              principalType: "USER",
              roleId: superAdminRole.id
            }, function(err, principal) {
              console.log(err, principal)
            })

          }
        })
        }
        
      });


    
    // Region Admins
    Role.findOrCreate({
      name: 'region-admin'
    }, function(err, role) {
      var admin = role;

      InternalUser.findOrCreate({
        username: "region-admin",
        email: "region-admin@hmis-eth.com",
        emailVerified: true,
        password: "region-admin"
      }, function(err, user){
        if (!err){
          RoleMapping.create({
            principalId: user.id,
            principalType: "USER",
            roleId: admin.id
          }, function(err, principal) {
            console.log(err, principal)
          });
        }
        Region.findOrCreate({
          
        })
      
      })
    });

    Role.findOrCreate({
      name: 'zone-admin'
    }, function(err, role) {
      var admin = role;

      InternalUser.findOrCreate({
        active: false,
        username: "zone-admin",        
        email: "zone-admin@hmis-eth.com",
        emailVerified: true,
        password: "zone-admin"
      }, function(err, user){
        if (!err){
          RoleMapping.create({
            principalId: user.id,
            principalType: "USER",
            roleId: admin.id
          }, function(err, principal) {
            console.log(err, principal)
          })

        }
      })
    });
    Role.findOrCreate({
      name: 'woreda-admin'
    }, function(err, role) {
      var admin = role;

      InternalUser.findOrCreate({
        active: false,
        username: "woreda-admin",
        email: "woreda-admin@hmis-eth.com",
        emailVerified: true,
        password: "woreda-admin"
      }, function(err, user){
        if (!err){
          RoleMapping.create({
            principalId: user.id,
            principalType: "USER",
            roleId: admin.id
          }, function(err, principal) {
            console.log(err, principal)
          })

        }
      })
    });
    
};