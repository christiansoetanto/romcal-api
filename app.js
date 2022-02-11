import * as functions from "@google-cloud/functions-framework";
import { GeneralRoman_En, GeneralRoman_La } from "@romcal/calendar.general-roman";
import Romcal from "romcal";
const romcalEn = new Romcal({
	scope: "liturgical",
	epiphanyOnSunday: true,
	corpusChristiOnSunday: true,
	ascensionOnSunday: false,
	localizedCalendar: GeneralRoman_En,
});
const romcalLa = new Romcal({
	scope: "liturgical",
	epiphanyOnSunday: true,
	corpusChristiOnSunday: true,
	ascensionOnSunday: false,
	localizedCalendar: GeneralRoman_La,
});

functions.http("romcal_api", async (req, res) => {
	const getLiturgicalDay = async (romcalObj) => {
		const calendar = await romcalObj.generateCalendar();
		const entries = Object.entries(calendar);
		const todayDateString = new Date().toISOString().split("T")[0];
		const liturgicalDay = entries
			.filter((e) => e[0] === todayDateString)[0][1]
			.map((e) => {
				return {
					key: e.key,
					date: e.date,
					precedence: e.precedence,
					rank: e.rank,
					isHolyDayOfObligation: e.isHolyDayOfObligation,
					isOptional: e.isOptional,
					martyrology: e.martyrology,
					titles: e.titles,
					calendar: e.calendar,
					cycles: e.cycles,
					name: e.name,
					rankName: e.rankName,
					colorName: e.colorNames,
					seasonNames: e.seasonNames,
				};
			});
		return liturgicalDay;
	};

	const liturgicalDayEn = await getLiturgicalDay(romcalEn);
	const liturgicalDayLa = await getLiturgicalDay(romcalLa);

	res.status(200).send({
		liturgicalDaysEn: liturgicalDayEn,
		liturgicalDaysLa: liturgicalDayLa,
	});
});
