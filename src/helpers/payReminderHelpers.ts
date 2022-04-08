import { MonthEnum } from "../consts/monthEnum";
import { ContentParam } from "../types/contentParam";

export const preparePayReminderParams = (): ContentParam[] => {
    const nextPaymentTime = new Date();
    nextPaymentTime.setDate(10);

    return  [{
        name: "next_payment_time",
        content: nextPaymentTime.toLocaleDateString()
    },{
        name: "payment_month",
        content: MonthEnum[nextPaymentTime.getMonth()]
    },{
        name: "contact_discord",
        content: process.env.CONTACT_USER_ID ? `<@!${[process.env.CONTACT_USER_ID]}>` : "Ugz'em"
    },{
        name: "contact_mail",
        content: "sprzedaz@orderofdevs.pl"
    }];
};
