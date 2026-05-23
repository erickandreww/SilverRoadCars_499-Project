require("dotenv").config()
const Util = {}

Util.getUsersGrid = async function(data) {
    let grid = "";
    if (data && data.length > 0) {
      grid = '<ul id="inv-display">';
      data.forEach(user => {
        grid += `<li> ${user.userName}</li>`;
    });
    grid += "</ul>";
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

module.exports = Util