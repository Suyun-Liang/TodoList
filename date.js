/* A module for code that are not strictly related to main js file */

// module.exports(shortcut: exports) is a an object. Object has method associated with it.  
exports.getDate = function () {
        
    // generate formatted date
        const today = new Date();
        
        const option = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        };
              
        return today.toLocaleDateString('en-US', option);
}


exports.getDay = function() {
        
        const today = new Date();
        
        const option = {
            weekday: 'long',
        };
      
        return today.toLocaleDateString('en-US', option);
}


