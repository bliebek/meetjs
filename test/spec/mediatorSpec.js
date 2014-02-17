/*global describe, it, expect, waitsFor, runs, beforeEach*/
'use strict';
describe('module::Mediator', function(){
    describe('::subscribe', function(){
        var Mediator = false;
        beforeEach(function(){
            runs(function(){
                require(['modules/mediator'], function(Module){
                    Mediator = new Module();
                });
            });
            waitsFor(function(){
                return Mediator !== false;
            }, 'loading mediator module', 10000);
        });
        it('should add mediator interface to the object', function(){
            var candidate = {};

            runs(function(){
                Mediator.subscribe(candidate);
                expect(typeof candidate.fireEvent).toBe('function');
                expect(typeof candidate.trigger).toBe('function');
                expect(typeof candidate.addListener).toBe('function');
                expect(typeof candidate.removeListener).toBe('function');
                expect(typeof candidate.on).toBe('function');
                expect(typeof candidate.off).toBe('function');
                expect(typeof candidate.one).toBe('function');
            });
        });

        it('should add itself to the object', function(){
            var candidate = {};

            runs(function(){
                Mediator.subscribe(candidate);
                expect(candidate.mediator).toBe(Mediator);
            });
        });
    });
});
