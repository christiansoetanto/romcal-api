import * as functions from "@google-cloud/functions-framework";
import { GeneralRoman_En } from "@romcal/calendar.general-roman";
import Romcal from "romcal";
const romcal = new Romcal({
	scope: "liturgical",
	epiphanyOnSunday: true,
	corpusChristiOnSunday: true,
	ascensionOnSunday: false,
	localizedCalendar: GeneralRoman_En,
});

functions.http("romcal_api", async (req, res) => {
	const calendar = await romcal.generateCalendar();
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

	res.status(200).send(liturgicalDay);
});
