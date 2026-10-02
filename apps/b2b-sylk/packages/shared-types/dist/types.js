"use strict";
// ─── Lead Status ───
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRAIN_PRIORITY = exports.VALID_TRANSITIONS = void 0;
// ─── Valid Transitions ───
exports.VALID_TRANSITIONS = {
    raw: ["cleaned", "blacklist"],
    cleaned: ["ready_to_send", "blacklist"],
    ready_to_send: ["active_in_sequence"],
    active_in_sequence: ["replied", "cold", "unsubscribed", "bounced"],
    replied: ["warming", "disqualified", "waiting"],
    warming: ["qualified", "cold", "disqualified", "waiting", "replied"],
    funnel_started: ["funnel_completed"],
    funnel_completed: ["qualified", "disqualified"],
    qualified: ["booked"],
    booked: ["confirmed", "cancelled", "rescheduled"],
    rescheduled: ["booked"],
    confirmed: ["meeting_done", "no_show"],
    no_show: ["recovering", "booked"],
    recovering: ["booked", "blacklist", "waiting", "disqualified", "proposal_sent"],
    meeting_done: ["proposal_sent", "disqualified", "waiting", "recovering"],
    proposal_sent: ["won", "lost"],
    won: ["paid"],
    paid: ["onboarding"],
    onboarding: ["onboarded", "onboarding_stuck"],
    onboarding_stuck: ["onboarding"],
    onboarded: ["active_client"],
};
exports.BRAIN_PRIORITY = {
    strategic: 5,
    human: 4,
    sync: 3,
    ai: 2,
    async: 1,
};
