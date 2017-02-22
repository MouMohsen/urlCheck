var currentTime = new Date();

module.exports = function(lastChecked,priority){
  var priorityMintues = parseInt(priority*60);
  var timeDiff = Math.abs(currentTime - lastChecked);
  var diffMintues = Math.ceil(timeDiff / (1000 * 60 ));
  if (diffMintues >= priorityMintues ) {
    return true;
  }
  else {
    return false;
  }
}
