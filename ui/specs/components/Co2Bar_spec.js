import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Co2Bar from '../../src/js/components/Co2Bar';

describe('<Co2Bar />', () => {
    it('should have two <h3> tags', () => {
        const wrapper = shallow(<Co2Bar co2={1} trees={2} />);
        const expected = 2;
        const actual = wrapper.find('h3').length;

        expect(expected).to.equal(actual);
    });

    it('should display correct number of co2', () => {
        const wrapper = shallow(<Co2Bar co2={1} trees={2} />);
        const expected = '1 t CO2 gebunden';
        const actual = wrapper.find('h3').at(0).text();

        expect(expected).to.equal(actual);
    });

    it('should display correct number of trees', () => {
        const wrapper = shallow(<Co2Bar co2={1} trees={2} />);
        const expected = '2 Bäume gepflanzt';
        const actual = wrapper.find('h3').at(1).text();

        expect(expected).to.equal(actual);
    });

    it('should handle undefined value for co2', () => {
        const wrapper = shallow(<Co2Bar co2={undefined} trees={2} />);
        const expected = '0 t CO2 gebunden';
        const actual = wrapper.find('h3').at(0).text();

        expect(expected).to.equal(actual);
    });

    it('should handle undefined value for trees', () => {
        const wrapper = shallow(<Co2Bar co2={1} trees={undefined} />);
        const expected = '0 Bäume gepflanzt';
        const actual = wrapper.find('h3').at(1).text();

        expect(expected).to.equal(actual);
    });

    it('should convert co2 number to local string', () => {
        const wrapper = shallow(<Co2Bar co2={11111.22334455} trees={2} />);
        const expected = '11,111.223 t CO2 gebunden';
        const actual = wrapper.find('h3').at(0).text();

        expect(expected).to.equal(actual);
    });

    it('should convert trees number to local string', () => {
        const wrapper = shallow(<Co2Bar co2={1} trees={22222.33445566} />);
        const expected = '22,222.334 Bäume gepflanzt';
        const actual = wrapper.find('h3').at(1).text();

        expect(expected).to.equal(actual);
    });
});
