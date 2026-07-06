import { createRequire } from "module";
import Subscription from "../dbmodels/subscription.model";
import dayjs, { Dayjs } from "dayjs";
import { REMINDERS } from "../constants";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

//upstash only support commonjss
export const sendReminders = serve(async (context: any) => {
  //extracting the subId
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  //currentdate
  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed.... ${subscriptionId}`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    //if renewaldate is july 17 reminder dates will be july 7, july 10, july 15, july 16
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `reminder ${daysBefore} days before`,
        reminderDate
      );

      await triggerReminder(
        context,
        `reminder ${daysBefore} days before`
      );
    }
  }
});

const fetchSubscription = async (
  context: any,
  subscriptionId: string
) => {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate(
      "user",
      "username email"
    ).lean();
  });
};

//sleep untill the reminder date
const sleepUntilReminder = async (
  context: any,
  label: string,
  date: Dayjs
) => {
  console.log(`Sleeping until ${label} reminder at ${date.format()}`);
  await context.sleepUntil(label, date.toDate());
};

//trigger remidner
const triggerReminder = async (
  context: any,
  label: string
) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    //we can add any custom notifications like sms ,email......
  });
};