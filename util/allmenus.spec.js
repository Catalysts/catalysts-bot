var allmenus = require('./allmenus.js');
var expect = require('chai').expect;

var dummyMenusWithFailing = {
    testMenu: {
        getMenu: function(callback) {
            callback({title:'yummy-food', menu:'1. yumm1\n2. yummy2'});
        }
    },
    failingMenu:{
        getMenu: function(callback) {
            throw new Exception('ohno!');
        }
    }
};

describe('allmenus', () => {
    it('should work with buggy menus', (done) => {

        var dummySession = {
            send: function(msg) {
                console.log('got msg:\n' + msg);
                expect(msg).to.contain('yummy-food');
                expect(msg).to.contain('2. yummy2');
                expect(msg).not.to.contain('ohno');
                done();
            }
        };

        allmenus.sendAllMenus(dummySession, dummyMenusWithFailing);
    });
});
