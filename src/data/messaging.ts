/**
 * Generated message catalogues (fictional prototype data).
 *
 * Events and commands are organised **per system**, not per component: the
 * contract belongs to the system that defines it, and several components inside
 * that system produce and consume it. The documentation follows the same rule —
 * each message gets its own page directly below the system's
 * `5. Building Block View`, which is the section that describes how the building
 * blocks fit together and therefore what flows between them.
 *
 * In the target picture a generator produces this file and the message pages
 * from the contracts in the system repository.
 */
import {sectionPath} from './catalog';

export type MessageKind = 'event' | 'command';

/** A producer or consumer of a message. Internal parties name their component. */
export type Party = {
  readonly label: string;
  /** Component id when the party is a component of this system. */
  readonly component?: string;
  /**
   * Environments on which this party exists. Omitted means "everywhere".
   * A component that is only deployed on DEV must not appear as a consumer in
   * the production contract.
   */
  readonly onlyOn?: readonly string[];
};

export type MessageField = {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly description: string;
};

export type MessageVersion = {
  readonly version: string;
  readonly change: string;
  readonly compatibility: string;
};

export type MessageEntry = {
  readonly kind: MessageKind;
  /** Contract name, e.g. `DeclarationAccepted`. */
  readonly name: string;
  /** URL segment below the system's building block view. */
  readonly slug: string;
  readonly channel: string;
  readonly schema: string;
  readonly version: string;
  readonly description: string;
  readonly producer: Party;
  readonly consumers: readonly Party[];
  /** Field that guarantees ordering on the channel. */
  readonly partitionKey: string;
  readonly retention: string;
  readonly fields: readonly MessageField[];
  readonly example: string;
  readonly history?: readonly MessageVersion[];
};

export type SystemCatalogue = {
  readonly generator: string;
  readonly generatedAt: string;
  readonly sourceRepo: string;
  readonly revision: string;
  readonly messages: readonly MessageEntry[];
};

const EXAMPLE_SYSTEM_A: SystemCatalogue = {
  generator: 'bazg-msgdoc 0.4.1',
  generatedAt: '2026-08-04 03:12 UTC',
  sourceRepo: 'git.example.admin.ch/bazg-proto/example-system-a-contracts',
  revision: 'b7e4102',
  messages: [
    {
      kind: 'command',
      name: 'SubmitDeclaration',
      slug: 'submit-declaration',
      channel: 'bazg.proto.declaration.commands.v1',
      schema: 'declaration/SubmitDeclaration.avsc',
      version: '1.3.0',
      description:
        'Requests registration of a new goods declaration. Carries the declarant, the consignment and the goods items.',
      producer: {label: 'Trade Portal (external)'},
      consumers: [{label: 'Example Component A', component: 'example-component-a'}],
      partitionKey: 'declarationReference',
      retention: '30 days',
      fields: [
        {name: 'declarationReference', type: 'string', required: true, description: 'Declarant-assigned reference, unique per declarant.'},
        {name: 'declarantId', type: 'string', required: true, description: 'Legally responsible party.'},
        {name: 'representativeId', type: 'string', required: false, description: 'Party submitting on behalf of the declarant.'},
        {name: 'consignment', type: 'Consignment', required: true, description: 'Consignor, consignee, transport and border crossing point.'},
        {name: 'goodsItems', type: 'GoodsItem[]', required: true, description: 'At least one item, each with tariff code, mass and value.'},
        {name: 'signature', type: 'bytes', required: true, description: 'Portal signature over the payload; verified before acceptance.'},
      ],
      example: `{
  "declarationReference": "CH-2026-0004711",
  "declarantId": "CHE-123.456.789",
  "representativeId": null,
  "consignment": {
    "consignorId": "DE-88213",
    "consigneeId": "CHE-987.654.321",
    "borderCrossingPoint": "Basel/Weil am Rhein",
    "transportMode": "ROAD"
  },
  "goodsItems": [
    {"tariffCode": "0901.21", "grossMassKg": 480.0, "valueChf": 12400.00}
  ]
}`,
      history: [
        {version: '1.3.0', change: 'Added optional `representativeId`', compatibility: 'Backward compatible'},
        {version: '1.2.0', change: 'Added `borderCrossingPoint` to `consignment`', compatibility: 'Backward compatible'},
      ],
    },
    {
      kind: 'command',
      name: 'CorrectDeclaration',
      slug: 'correct-declaration',
      channel: 'bazg.proto.declaration.commands.v1',
      schema: 'declaration/CorrectDeclaration.avsc',
      version: '1.1.0',
      description:
        'Requests a correction of an already accepted declaration. Refused once the declaration is cleared.',
      producer: {label: 'Trade Portal (external)'},
      consumers: [{label: 'Example Component A', component: 'example-component-a'}],
      partitionKey: 'declarationId',
      retention: '30 days',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'Declaration to correct.'},
        {name: 'baseRevision', type: 'integer', required: true, description: 'Revision the correction was written against; a stale value is refused.'},
        {name: 'changes', type: 'FieldChange[]', required: true, description: 'Field-level changes, not a full replacement.'},
        {name: 'reason', type: 'string', required: true, description: 'Declarant-supplied reason, kept for the audit trail.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "baseRevision": 1,
  "changes": [
    {"path": "goodsItems[0].grossMassKg", "from": 480.0, "to": 512.5}
  ],
  "reason": "Re-weighed at the consolidation warehouse"
}`,
    },
    {
      kind: 'command',
      name: 'RecalculateRisk',
      slug: 'recalculate-risk',
      channel: 'bazg.proto.risk.commands.v1',
      schema: 'risk/RecalculateRisk.avsc',
      version: '1.0.0',
      description:
        'Manual re-evaluation requested by a risk analyst, for example after a rule set rollback.',
      producer: {label: 'Risk Operations Console (external)'},
      consumers: [{label: 'Example Component B', component: 'example-component-b'}],
      partitionKey: 'declarationId',
      retention: '90 days',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'Declaration whose risk case is re-evaluated.'},
        {name: 'revision', type: 'integer', required: true, description: 'Revision to evaluate; a decision is always bound to one revision.'},
        {name: 'requestedBy', type: 'string', required: true, description: 'Analyst identity; required for the audit trail.'},
        {name: 'reason', type: 'string', required: true, description: 'Why the re-evaluation was requested.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "revision": 2,
  "requestedBy": "analyst:ka",
  "reason": "Rule set 2026.08 rolled back to 2026.07"
}`,
    },
    {
      kind: 'command',
      name: 'OrderInspection',
      slug: 'order-inspection',
      channel: 'bazg.proto.inspection.commands.v1',
      schema: 'inspection/OrderInspection.avsc',
      version: '2.1.0',
      description:
        'Requests a physical or documentary inspection for a consignment in the high risk band. The receiving system may refuse it.',
      producer: {label: 'Example Component B', component: 'example-component-b'},
      consumers: [{label: 'Inspection Planning (external)'}],
      partitionKey: 'declarationId',
      retention: '10 years',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'Consignment to inspect.'},
        {name: 'revision', type: 'integer', required: true, description: 'Revision the decision was taken on.'},
        {name: 'inspectionType', type: 'enum', required: true, description: '`DOCUMENTARY` or `PHYSICAL`.'},
        {name: 'priority', type: 'enum', required: true, description: '`NORMAL` or `URGENT`; urgent only for perishable goods.'},
        {name: 'riskCaseId', type: 'string', required: true, description: 'Reference to the evidence, so the officer can see why.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "revision": 2,
  "inspectionType": "PHYSICAL",
  "priority": "NORMAL",
  "riskCaseId": "rc-40b1e9"
}`,
    },
    {
      kind: 'event',
      name: 'DeclarationAccepted',
      slug: 'declaration-accepted',
      channel: 'bazg.proto.declaration.events.v1',
      schema: 'declaration/DeclarationAccepted.avsc',
      version: '2.0.0',
      description:
        'The declaration passed structural and customs rule validation and was persisted. Starts the risk assessment.',
      producer: {label: 'Example Component A', component: 'example-component-a'},
      consumers: [
        {label: 'Example Component B', component: 'example-component-b'},
        {label: 'Audit Trail Service (external)'},
      ],
      partitionKey: 'declarationId',
      retention: '10 years',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'System-assigned identifier.'},
        {name: 'revision', type: 'integer', required: true, description: 'Revision this statement refers to.'},
        {name: 'declarantId', type: 'string', required: true, description: 'Legally responsible party.'},
        {name: 'consignment', type: 'Consignment', required: true, description: 'Consignment as accepted.'},
        {name: 'goodsItems', type: 'GoodsItem[]', required: true, description: 'Goods items as accepted.'},
        {name: 'acceptedAt', type: 'timestamp', required: true, description: 'When acceptance happened, not when it was published.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "revision": 1,
  "declarantId": "CHE-123.456.789",
  "consignment": {"borderCrossingPoint": "Basel/Weil am Rhein", "transportMode": "ROAD"},
  "goodsItems": [{"tariffCode": "0901.21", "grossMassKg": 480.0, "valueChf": 12400.00}],
  "acceptedAt": "2026-08-04T05:12:44Z"
}`,
      history: [
        {version: '2.0.0', change: '`consignment` restructured into `consignment` + `goodsItems[]`', compatibility: 'Breaking — v1 channel retired 2026-03-31'},
        {version: '1.4.0', change: 'Added `declarantReference`', compatibility: 'Backward compatible'},
      ],
    },
    {
      kind: 'event',
      name: 'DeclarationRejected',
      slug: 'declaration-rejected',
      channel: 'bazg.proto.declaration.events.v1',
      schema: 'declaration/DeclarationRejected.avsc',
      version: '2.0.0',
      description:
        'Validation failed. A business outcome, not a technical failure — carries the machine-readable rule violations shown to the declarant.',
      producer: {label: 'Example Component A', component: 'example-component-a'},
      consumers: [
        {label: 'Trade Portal (external)'},
        {label: 'Audit Trail Service (external)'},
        {label: 'Example Component D', component: 'example-component-d', onlyOn: ['dev']},
      ],
      partitionKey: 'declarationReference',
      retention: '10 years',
      fields: [
        {name: 'declarationReference', type: 'string', required: true, description: 'Declarant reference; no declaration id exists, because nothing was stored.'},
        {name: 'violations', type: 'RuleViolation[]', required: true, description: 'Rule id, field path and accepted value range.'},
        {name: 'rejectedAt', type: 'timestamp', required: true, description: 'When the rejection was decided.'},
      ],
      example: `{
  "declarationReference": "CH-2026-0004711",
  "violations": [
    {"ruleId": "CU-0142", "path": "goodsItems[0].tariffCode", "message": "Tariff code not valid on this date"}
  ],
  "rejectedAt": "2026-08-04T05:12:44Z"
}`,
    },
    {
      kind: 'event',
      name: 'DeclarationAmended',
      slug: 'declaration-amended',
      channel: 'bazg.proto.declaration.events.v1',
      schema: 'declaration/DeclarationAmended.avsc',
      version: '1.2.0',
      description:
        'A correction was applied and a new revision exists. Consumers must re-evaluate any decision taken on the previous revision.',
      producer: {label: 'Example Component A', component: 'example-component-a'},
      consumers: [
        {label: 'Example Component B', component: 'example-component-b'},
        {label: 'Audit Trail Service (external)'},
      ],
      partitionKey: 'declarationId',
      retention: '10 years',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'Declaration that was amended.'},
        {name: 'revision', type: 'integer', required: true, description: 'The new revision.'},
        {name: 'supersedesRevision', type: 'integer', required: true, description: 'The revision that is now stale.'},
        {name: 'changes', type: 'FieldChange[]', required: true, description: 'What changed, for consumers that can evaluate incrementally.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "revision": 2,
  "supersedesRevision": 1,
  "changes": [{"path": "goodsItems[0].grossMassKg", "from": 480.0, "to": 512.5}]
}`,
    },
    {
      kind: 'event',
      name: 'RiskAssessmentCompleted',
      slug: 'risk-assessment-completed',
      channel: 'bazg.proto.risk.events.v1',
      schema: 'risk/RiskAssessmentCompleted.avsc',
      version: '1.4.0',
      description:
        'Final risk decision for one declaration revision. Carries the score, the band and everything needed to reproduce the decision.',
      producer: {label: 'Example Component B', component: 'example-component-b'},
      consumers: [
        {label: 'Example Component A', component: 'example-component-a'},
        {label: 'Audit Trail Service (external)'},
      ],
      partitionKey: 'declarationId',
      retention: '10 years',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'Declaration the decision belongs to.'},
        {name: 'revision', type: 'integer', required: true, description: 'Revision the decision was taken on; a decision is never revision-free.'},
        {name: 'band', type: 'enum', required: true, description: '`low`, `elevated` or `high`. The band, not the score, drives the outcome.'},
        {name: 'score', type: 'double', required: true, description: 'Raw score; internal, never shown to the declarant.'},
        {name: 'firedRules', type: 'string[]', required: true, description: 'Rules that contributed — the officer-facing explanation.'},
        {name: 'ruleSetVersion', type: 'string', required: true, description: 'Immutable rule set version.'},
        {name: 'modelVersion', type: 'string', required: true, description: 'Immutable scoring model version.'},
        {name: 'fallback', type: 'boolean', required: true, description: 'True when the model was unavailable and the fallback rule set decided.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "revision": 1,
  "band": "low",
  "score": 0.31,
  "firedRules": ["R-102", "R-217"],
  "ruleSetVersion": "2026.07",
  "modelVersion": "v14",
  "fallback": false
}`,
      history: [
        {version: '1.4.0', change: 'Added `ruleSetVersion` and `modelVersion`', compatibility: 'Backward compatible — required for traceability'},
        {version: '1.2.0', change: 'Added `fallback`', compatibility: 'Backward compatible'},
      ],
    },
    {
      kind: 'event',
      name: 'DeclarationCleared',
      slug: 'declaration-cleared',
      channel: 'bazg.proto.declaration.events.v1',
      schema: 'declaration/DeclarationCleared.avsc',
      version: '1.2.0',
      description:
        'The consignment may proceed. Terminal state of the happy path.',
      producer: {label: 'Example Component A', component: 'example-component-a'},
      consumers: [
        {label: 'Border Control Operations (external)'},
        {label: 'Trade Portal (external)'},
        {label: 'Audit Trail Service (external)'},
        {label: 'Example Component D', component: 'example-component-d', onlyOn: ['dev']},
      ],
      partitionKey: 'declarationId',
      retention: '10 years',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'Cleared declaration.'},
        {name: 'revision', type: 'integer', required: true, description: 'Revision that was cleared.'},
        {name: 'clearedAt', type: 'timestamp', required: true, description: 'When clearance was decided.'},
        {name: 'riskBand', type: 'enum', required: true, description: 'Band the clearance was based on; always `low`.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "revision": 1,
  "clearedAt": "2026-08-04T05:12:51Z",
  "riskBand": "low"
}`,
    },
    {
      kind: 'event',
      name: 'DeclarationHeld',
      slug: 'declaration-held',
      channel: 'bazg.proto.declaration.events.v1',
      schema: 'declaration/DeclarationHeld.avsc',
      version: '1.2.0',
      description:
        'The consignment is withheld until an inspection decision exists. Carries the risk case reference so the officer can see the evidence.',
      producer: {label: 'Example Component A', component: 'example-component-a'},
      consumers: [
        {label: 'Inspection Planning (external)'},
        {label: 'Trade Portal (external)'},
        {label: 'Audit Trail Service (external)'},
        {label: 'Example Component D', component: 'example-component-d', onlyOn: ['dev']},
      ],
      partitionKey: 'declarationId',
      retention: '10 years',
      fields: [
        {name: 'declarationId', type: 'string', required: true, description: 'Withheld declaration.'},
        {name: 'revision', type: 'integer', required: true, description: 'Revision that was held.'},
        {name: 'riskBand', type: 'enum', required: true, description: '`elevated` or `high`.'},
        {name: 'riskCaseId', type: 'string', required: true, description: 'Reference to the evidence.'},
        {name: 'heldAt', type: 'timestamp', required: true, description: 'When the hold was decided.'},
      ],
      example: `{
  "declarationId": "d-8f21c0",
  "revision": 2,
  "riskBand": "high",
  "riskCaseId": "rc-40b1e9",
  "heldAt": "2026-08-04T05:14:02Z"
}`,
    },
    {
      kind: 'event',
      name: 'RiskModelDeployed',
      slug: 'risk-model-deployed',
      channel: 'bazg.proto.risk.events.v1',
      schema: 'risk/RiskModelDeployed.avsc',
      version: '1.0.0',
      description:
        'A new rule set or scoring model version became active. Recorded so that every past decision stays reproducible.',
      producer: {label: 'Example Component B', component: 'example-component-b'},
      consumers: [
        {label: 'Model Registry (external)'},
        {label: 'Audit Trail Service (external)'},
      ],
      partitionKey: 'artifactType',
      retention: '10 years',
      fields: [
        {name: 'artifactType', type: 'enum', required: true, description: '`RULE_SET` or `SCORING_MODEL`.'},
        {name: 'version', type: 'string', required: true, description: 'Immutable version that became active.'},
        {name: 'previousVersion', type: 'string', required: true, description: 'What it replaced; makes a rollback visible in the log.'},
        {name: 'activatedAt', type: 'timestamp', required: true, description: 'From when decisions use this version.'},
      ],
      example: `{
  "artifactType": "RULE_SET",
  "version": "2026.08",
  "previousVersion": "2026.07",
  "activatedAt": "2026-08-04T04:00:00Z"
}`,
    },
  ],
};

const EXAMPLE_SYSTEM_B: SystemCatalogue = {
  generator: 'bazg-msgdoc 0.4.1',
  generatedAt: '2026-08-03 03:10 UTC',
  sourceRepo: 'git.example.admin.ch/bazg-proto/example-system-b-contracts',
  revision: 'a90f331',
  messages: [
    {
      kind: 'command',
      name: 'SendOperationalBroadcast',
      slug: 'send-operational-broadcast',
      channel: 'bazg.proto.notification.commands.v1',
      schema: 'notification/SendOperationalBroadcast.avsc',
      version: '1.0.0',
      description:
        'Manually triggered broadcast, for example an unplanned border closure. Requires four-eyes approval before it is issued.',
      producer: {label: 'Operations Console (external)'},
      consumers: [{label: 'Example Component C', component: 'example-component-c'}],
      partitionKey: 'broadcastId',
      retention: '90 days',
      fields: [
        {name: 'broadcastId', type: 'string', required: true, description: 'Identifier a correction can reference later.'},
        {name: 'region', type: 'string', required: true, description: 'Affected region; decides which subscriptions match.'},
        {name: 'texts', type: 'Map<locale,string>', required: true, description: 'All four languages; a missing one blocks publication.'},
        {name: 'approvedBy', type: 'string[]', required: true, description: 'Two identities — four-eyes approval.'},
      ],
      example: `{
  "broadcastId": "bc-2026-0912",
  "region": "basel-city",
  "texts": {"de": "…", "fr": "…", "it": "…", "en": "…"},
  "approvedBy": ["ops:mr", "ops:sb"]
}`,
    },
    {
      kind: 'event',
      name: 'NotificationRequested',
      slug: 'notification-requested',
      channel: 'bazg.proto.notification.events.v1',
      schema: 'notification/NotificationRequested.avsc',
      version: '1.1.0',
      description:
        'A finished, translated notification should be delivered on all opted-in channels.',
      producer: {label: 'Transit Status Service'},
      consumers: [{label: 'Example Component C', component: 'example-component-c'}],
      partitionKey: 'notificationId',
      retention: '90 days',
      fields: [
        {name: 'notificationId', type: 'string', required: true, description: 'Idempotency key for the fan-out.'},
        {name: 'region', type: 'string', required: true, description: 'Which subscriptions match.'},
        {name: 'texts', type: 'Map<locale,string>', required: true, description: 'Already translated; this component never composes text.'},
        {name: 'severity', type: 'enum', required: true, description: '`INFO` or `DISRUPTION`.'},
      ],
      example: `{
  "notificationId": "n-77c1",
  "region": "basel-city",
  "texts": {"de": "…", "fr": "…", "it": "…", "en": "…"},
  "severity": "DISRUPTION"
}`,
    },
    {
      kind: 'event',
      name: 'NotificationDelivered',
      slug: 'notification-delivered',
      channel: 'bazg.proto.notification.events.v1',
      schema: 'notification/NotificationDelivered.avsc',
      version: '1.1.0',
      description:
        'Per-channel delivery confirmation, aggregated per notification. Feeds the delivery rate indicator.',
      producer: {label: 'Example Component C', component: 'example-component-c'},
      consumers: [{label: 'Audit Trail Service (external)'}],
      partitionKey: 'notificationId',
      retention: '90 days',
      fields: [
        {name: 'notificationId', type: 'string', required: true, description: 'Notification that was delivered.'},
        {name: 'channel', type: 'enum', required: true, description: '`EMAIL`, `PUSH` or `STATUS_PAGE`.'},
        {name: 'accepted', type: 'integer', required: true, description: 'Addresses the provider accepted.'},
        {name: 'failed', type: 'integer', required: true, description: 'Addresses that exhausted their retries.'},
      ],
      example: `{
  "notificationId": "n-77c1",
  "channel": "EMAIL",
  "accepted": 39714,
  "failed": 286
}`,
    },
    {
      kind: 'event',
      name: 'NotificationFailed',
      slug: 'notification-failed',
      channel: 'bazg.proto.notification.events.v1',
      schema: 'notification/NotificationFailed.avsc',
      version: '1.1.0',
      description:
        'All delivery attempts on a channel were exhausted. Raises an operations alert.',
      producer: {label: 'Example Component C', component: 'example-component-c'},
      consumers: [{label: 'Operations Alerting (external)'}],
      partitionKey: 'notificationId',
      retention: '90 days',
      fields: [
        {name: 'notificationId', type: 'string', required: true, description: 'Notification that could not be delivered.'},
        {name: 'channel', type: 'enum', required: true, description: 'Channel that failed.'},
        {name: 'reason', type: 'string', required: true, description: 'Last provider error, normalised.'},
        {name: 'attempts', type: 'integer', required: true, description: 'Attempts made before giving up.'},
      ],
      example: `{
  "notificationId": "n-77c1",
  "channel": "PUSH",
  "reason": "PROVIDER_REJECTED_TOKEN",
  "attempts": 5
}`,
    },
  ],
};

const CATALOGUES: Record<string, SystemCatalogue> = {
  'example-system-a': EXAMPLE_SYSTEM_A,
  'example-system-b': EXAMPLE_SYSTEM_B,
};

export function systemCatalogue(systemId: string): SystemCatalogue {
  const catalogue = CATALOGUES[systemId];
  if (!catalogue) {
    throw new Error(
      `No message catalogue for system "${systemId}". Known: ${Object.keys(CATALOGUES).join(', ')}`,
    );
  }
  return catalogue;
}

/** Parties that exist on the given environment. */
export function partiesOn(
  parties: readonly Party[],
  environmentId: string,
): readonly Party[] {
  return parties.filter((party) => !party.onlyOn || party.onlyOn.includes(environmentId));
}

export function messageByName(systemId: string, name: string): MessageEntry {
  const entry = systemCatalogue(systemId).messages.find((m) => m.name === name);
  if (!entry) {
    throw new Error(
      `Message "${name}" is not in the catalogue of ${systemId}. Known: ${systemCatalogue(systemId)
        .messages.map((m) => m.name)
        .join(', ')}`,
    );
  }
  return entry;
}

/** Messages a component produces or consumes, in catalogue order. */
export function messagesOfComponent(
  systemId: string,
  componentId: string,
  environmentId?: string,
): {produced: MessageEntry[]; consumed: MessageEntry[]} {
  const messages = systemCatalogue(systemId).messages;
  const visible = (parties: readonly Party[]) =>
    environmentId ? partiesOn(parties, environmentId) : parties;
  return {
    produced: messages.filter((m) => m.producer.component === componentId),
    consumed: messages.filter((m) =>
      visible(m.consumers).some((c) => c.component === componentId),
    ),
  };
}

/**
 * Contracts are grouped by kind below the building block view, so the URL says
 * what the page is before you open it.
 *
 * `/systems/example-system-a/system-architecture/building-block-view/events/declaration-accepted/`
 */
export function messagePath(systemId: string, name: string): string {
  const message = messageByName(systemId, name);
  const group = message.kind === 'command' ? 'commands' : 'events';
  return `${sectionPath(
    systemId,
    undefined,
    'system-architecture',
    'building-block-view',
  )}${group}/${message.slug}/`;
}
