class RangeList {
  /**
   * Adds a range to the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  constructor(){
    this.data = [];
  }

  add( range ) {
    if ( range.sort(function(a, b){return a-b})[0] == range.sort(function(a, b){return a-b})[1] ) {
      return;
    }
    
    if ( this.data.length ) {
      let overrides = this.checkRangeOverflow( range.sort(function(a, b){return a-b}) );
      this.addOverrides( overrides, range.sort(function(a, b){return a-b}) );
    } else {
      this.data.push( range.sort(function(a, b){return a-b}) );
    }
  }

  /**
   * Handler for add
   */
  addOverrides( overrides, range ) {
    if ([...new Set(overrides)].length == 1 && [...new Set(overrides)][0] == 'rightouter' ){
      this.data.push( range );
      return;
    } else if ( [...new Set(overrides)].length == 1 && [...new Set(overrides)][0] == 'leftouter' ) {
      this.data.unshift( range );
      return;
    }

    for (var i = 0; i < overrides.length; i++) {
      if ( overrides[i] == 'rightouter' ) {
        if( overrides[i+1] && overrides[i+1] == 'leftouter' ) {
          this.data.splice(i+1, 0, range );
          continue;
        }
      } else if ( overrides[i] == 'rightoverride' ) {
        if( overrides[i+1] && overrides[i+1] == 'leftoverride' ) {
          this.data[i][1] = this.data[i+1][1];
          this.data.splice(i+1,1);
          overrides.splice(i+1,1);
        } else {
          this.data[i][1] = range[1];   
        }
        continue;
      } else if ( overrides[i] == 'leftoverride' ) {
        if( overrides[i-1] && overrides[i-1] == 'rightoverride' ) {
          this.data[i-1][1] = this.data[i][1];
          this.data.splice(i,1);
          overrides.splice(i,1);
        } else {
          this.data[i][0] = range[0];   
        }
        continue;
      } else if ( overrides[i] == 'fulloverride' ) {
        this.data.splice(i,1);
        overrides.splice(i,1);
        i-=1;
        continue;
      }
    }
  }

  /**
   * Removes a range from the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove( range ) {  
    if ( range.sort(function(a, b){return a-b})[0] == range.sort(function(a, b){return a-b})[1] ) {
      return;
    }

    if ( this.data.length ) {
      let overrides = this.checkRangeOverflow( range.sort(function(a, b){return a-b}) );
      this.removeOverrides( overrides, range.sort(function(a, b){return a-b}) );
    } else {
      return;
    }
  }

  /**
   * Handler for remove
   */
  removeOverrides( overrides, range ) {
    if ([...new Set(overrides)].length == 1 && [...new Set(overrides)][0] == 'rightouter' ){
      return;
    } else if ( [...new Set(overrides)].length == 1 && [...new Set(overrides)][0] == 'leftouter' ) {
      return;
    }

    for (var i = 0; i < overrides.length; i++) {
      if ( overrides[i] == 'rightoverride' ) {
        this.data[i][1] = range[0];
        continue;
      } else if ( overrides[i] == 'leftoverride' ) {
        this.data[i][0] = range[1];
        continue;
      } else if ( overrides[i] == 'inner' ) {
        let temp = this.data[i][1];
        this.data[i][1] = range[0];
        this.data.splice(i+1, 0, [range[1], temp] );
        continue;
      } else if ( overrides[i] == 'fulloverride' ) {
        this.data.splice(i,1);
        overrides.splice(i,1);
        i-=1;
        continue;
      }
    }
  }

  /**
   * Checks the given range with existing range for overflow
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  checkRangeOverflow( range ) {
    range = range.sort(function(a, b){return a-b});
    var overrides = [];

    this.data.forEach( subrange => {
      if ( range[0] <= subrange[0] && range[1] >= subrange[1] ) {
        overrides.push('fulloverride');
      } else if ( range[0] <= subrange[0] && range[1] >= subrange[0] && range[1] < subrange[1] ) {
        overrides.push('leftoverride');
      } else if ( range[0] < subrange[0] && range[1] < subrange[0] ) {
        overrides.push('leftouter');
      } else if ( range[0] <= subrange[1] && range[0] > subrange[0] && range[1] >= subrange[1] ) {
        overrides.push('rightoverride');
      } else if ( range[0] > subrange[1] && range[1] > subrange[1] ) {
        overrides.push('rightouter');
      } else if ( range[0] > subrange[0] && range[0] < subrange[1] && range[1] > subrange[0] && range[1] < subrange[1] ) {
        overrides.push('inner');
      } else {
        overrides.push('outofrange');
      }
    });
    return overrides;
  }



  /**
   * Prints out the list of ranges in the range list
   */
  print() {
    let op = '';
    for (let index = 0; index < this.data.length; index++) {
      op = op + '[' + this.data[index] + ')';
      if(index != this.data.length - 1) {
        op = op + ' ';
      }
    }
    console.log( op );
  }
}

// Example run
const rl = new RangeList();

rl.add([1, 5]);
rl.print();
// Should display: [1, 5)

rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)

rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)

rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)

rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)

rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)

rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)