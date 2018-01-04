export default {
    startDate: new Date('2009-03-16'),  //these are in UTC time https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
    endDate: new Date('2039-06-17'),
    strikeout: true,  //cross out days beginning with startDate up to the current date
    circle: true,  //circle the startDate and endDate
    canvasSize: 2000,
    yearFontSizePercentage: 1.2,
    dayFontSizePercentage: .6,
    ringWidthPercentage: .5,
    getYearFontSize: function() { return this.canvasSize * this.yearFontSizePercentage / 100; },
    getDayFontSize: function() { return this.canvasSize * this.dayFontSizePercentage / 100; },
    getYearsTextRadius: function() { return this.canvasSize / 2 - (55 * this.getRingWidth()) },
    getRingWidth: function() { return this.canvasSize * this.ringWidthPercentage / 100 },
    getYearAngle: function() { return 360 / (this.endDate.getFullYear() - this.startDate.getFullYear() + 1); },
    getYearAngleHalf: function() { return this.getYearAngle() / 2; },
    getWeekdayAngle: function() { return this.getYearAngle() / 7; },
    getWeekdayAngleHalf: function() { return this.getWeekdayAngle() / 2; },
    getIth: function(year) { return year - this.startDate.getFullYear(); }
}