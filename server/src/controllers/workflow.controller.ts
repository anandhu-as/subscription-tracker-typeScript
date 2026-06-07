//import wont work with upstashh since it is written in commonjs
import { WorkflowContext } from "@upstash/workflow";
import { createRequire } from "module";
import { ReminderPayload } from "../types/types.js";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
const REMINDERS = [7, 5, 2, 1];
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
export const sendReminders = serve(
  async (context: WorkflowContext<ReminderPayload>) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);
    //checking if the sub exists??
    if (!subscription || subscription.status !== "active") {
      return;
    }
    //if exists
    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
      console.log(
        `Renewal date has passed for subscription ${subscriptionId} stopping workflow`,
      );
      return;
    }
    //renewaldate - reminders 1,2,5,7,
    for (const x of REMINDERS) {
      const reminderDate = renewalDate.subtract(x, "day");

      if (reminderDate.isAfter(dayjs())) {
        await sleepUntilReminder(
          context,
          `Reminder ${x} days before`,
          reminderDate,
        );
      }

      await triggerReminder(context, `Reminder ${x} days before`);
    }
  },
);
//The function receives a subscriptionId
//fetches the subscription details from db using id
//sub docuemnt contains ref to user and replaces userid with actual user data
const fetchSubscription = async (
  context: WorkflowContext<ReminderPayload>,
  subscriptionId: string,
) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

import { Dayjs } from "dayjs";

const sleepUntilReminder = async (
  context: WorkflowContext<ReminderPayload>,
  label: string,
  date: Dayjs,
) => {
  console.log(`sleeping untill ${label} Reminder at ${date}`);
  await context.sleepUntil(label, date.toDate()); //Pause this workflow until the specified date, then resume execution
};

const triggerReminder = async (
  context: WorkflowContext<ReminderPayload>,
  label: string,
) => {
  await context.run(label, () => {
    console.log(`triggering ${label} reminder`);
    //send notification
  });
};
