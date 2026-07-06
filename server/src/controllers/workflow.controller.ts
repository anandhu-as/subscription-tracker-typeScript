import { createRequire } from "module";
import Subscription from "../dbmodels/subscription.model";
import dayjs, { Dayjs } from "dayjs";
import { REMINDERS } from "../constants";
import { sendEmail } from "../utilities/sendEmail";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

//upstash only support commonjss
export const sendReminders = serve(async (context: any) => {
  //extracting the subId
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  // Send an immediate confirmation email as soon as the subscription is created
  await triggerReminder(
    context,
    "Subscription Confirmation",
    subscription,
  );

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
        reminderDate,
      );

      await triggerReminder(
        context,
        `reminder ${daysBefore} days before`,
        subscription,
      );
    }
  }
});

const fetchSubscription = async (context: any, subscriptionId: string) => {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId)
      .populate("user", "username email")
      .lean();
  });
};

//sleep untill the reminder date
const sleepUntilReminder = async (context: any, label: string, date: Dayjs) => {
  console.log(`Sleeping until ${label} reminder at ${date.format()}`);
  await context.sleepUntil(label, date.toDate());
};

//trigger remidner
export const triggerReminder = async (
  context: any,
  label: string,
  subscription: any,
) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    const { user, name, renewalDate } = subscription;

    await sendEmail(
      user.email,
      `Reminder: "${name}" renews soon`,
      `
        <p>Hi ${user.username},</p>
        <p>Your subscription <strong>${name}</strong> is renewing on 
        <strong>${dayjs(renewalDate).format("MMM D, YYYY")}</strong>.</p>
        <p>This is your ${label}.</p>
      `,
    );
  });
};
