/**
 * Generated messaging catalogues (fictional prototype data).
 *
 * In the target picture these entries are produced by a generator that reads
 * the message contracts out of the component repositories. Here they are a
 * static stand-in with the same shape, so the presentation components and the
 * cross-links from the runtime views already work against the real structure.
 */
import {componentPath} from './catalog';

export type MessageKind = 'event' | 'command';
export type MessageDirection = 'inbound' | 'outbound';

export type MessageEntry = {
  readonly kind: MessageKind;
  readonly name: string;
  readonly direction: MessageDirection;
  readonly producer: string;
  readonly consumer: string;
  /** Broker channel / topic name. */
  readonly channel: string;
  readonly schema: string;
  readonly version: string;
  readonly description: string;
};

export type MessagingCatalogueEntry = {
  readonly systemId: string;
  readonly componentId: string;
  readonly generator: string;
  readonly generatedAt: string;
  readonly sourceRepo: string;
  readonly revision: string;
  readonly messages: readonly MessageEntry[];
};

const CATALOGUES: readonly MessagingCatalogueEntry[] = [
  {
    systemId: 'example-system-a',
    componentId: 'example-component-a',
    generator: 'bazg-msgdoc 0.4.1',
    generatedAt: '2026-08-04 03:12 UTC',
    sourceRepo: 'git.example.admin.ch/bazg-proto/declaration-intake-service',
    revision: '9c1e40d',
    messages: [
      {
        kind: 'command',
        name: 'SubmitDeclaration',
        direction: 'inbound',
        producer: 'Trade Portal (external)',
        consumer: 'Example Component A',
        channel: 'bazg.proto.declaration.commands.v1',
        schema: 'declaration/SubmitDeclaration.avsc',
        version: '1.3.0',
        description:
          'Requests registration of a new goods declaration. Carries the declarant, the consignment and the goods items.',
      },
      {
        kind: 'command',
        name: 'CorrectDeclaration',
        direction: 'inbound',
        producer: 'Trade Portal (external)',
        consumer: 'Example Component A',
        channel: 'bazg.proto.declaration.commands.v1',
        schema: 'declaration/CorrectDeclaration.avsc',
        version: '1.1.0',
        description:
          'Requests a correction of an already accepted declaration before clearance. Rejected once the declaration is cleared.',
      },
      {
        kind: 'event',
        name: 'DeclarationAccepted',
        direction: 'outbound',
        producer: 'Example Component A',
        consumer: 'Example Component B, Audit Trail Service (external)',
        channel: 'bazg.proto.declaration.events.v1',
        schema: 'declaration/DeclarationAccepted.avsc',
        version: '2.0.0',
        description:
          'The declaration passed structural and customs rule validation and was persisted. Triggers risk assessment.',
      },
      {
        kind: 'event',
        name: 'DeclarationRejected',
        direction: 'outbound',
        producer: 'Example Component A',
        consumer: 'Trade Portal (external), Audit Trail Service (external)',
        channel: 'bazg.proto.declaration.events.v1',
        schema: 'declaration/DeclarationRejected.avsc',
        version: '2.0.0',
        description:
          'Validation failed. Carries the machine-readable rule violations shown to the declarant.',
      },
      {
        kind: 'event',
        name: 'DeclarationAmended',
        direction: 'outbound',
        producer: 'Example Component A',
        consumer: 'Example Component B, Audit Trail Service (external)',
        channel: 'bazg.proto.declaration.events.v1',
        schema: 'declaration/DeclarationAmended.avsc',
        version: '1.2.0',
        description:
          'A correction was applied. Consumers must re-evaluate any decision taken on the previous revision.',
      },
      {
        kind: 'event',
        name: 'RiskAssessmentCompleted',
        direction: 'inbound',
        producer: 'Example Component B',
        consumer: 'Example Component A',
        channel: 'bazg.proto.risk.events.v1',
        schema: 'risk/RiskAssessmentCompleted.avsc',
        version: '1.4.0',
        description:
          'Risk decision for a declaration revision. Moves the declaration to cleared or held.',
      },
      {
        kind: 'event',
        name: 'DeclarationCleared',
        direction: 'outbound',
        producer: 'Example Component A',
        consumer: 'Border Control Operations (external), Audit Trail Service (external)',
        channel: 'bazg.proto.declaration.events.v1',
        schema: 'declaration/DeclarationCleared.avsc',
        version: '1.2.0',
        description:
          'The consignment may proceed. Terminal state for the happy path of a declaration.',
      },
      {
        kind: 'event',
        name: 'DeclarationHeld',
        direction: 'outbound',
        producer: 'Example Component A',
        consumer: 'Inspection Planning (external), Audit Trail Service (external)',
        channel: 'bazg.proto.declaration.events.v1',
        schema: 'declaration/DeclarationHeld.avsc',
        version: '1.2.0',
        description:
          'The consignment is withheld pending an inspection decision. Carries the risk case reference.',
      },
    ],
  },
  {
    systemId: 'example-system-a',
    componentId: 'example-component-b',
    generator: 'bazg-msgdoc 0.4.1',
    generatedAt: '2026-08-04 03:14 UTC',
    sourceRepo: 'git.example.admin.ch/bazg-proto/risk-assessment-engine',
    revision: '3fd8b52',
    messages: [
      {
        kind: 'event',
        name: 'DeclarationAccepted',
        direction: 'inbound',
        producer: 'Example Component A',
        consumer: 'Example Component B',
        channel: 'bazg.proto.declaration.events.v1',
        schema: 'declaration/DeclarationAccepted.avsc',
        version: '2.0.0',
        description: 'Starts a risk case for the accepted declaration revision.',
      },
      {
        kind: 'event',
        name: 'DeclarationAmended',
        direction: 'inbound',
        producer: 'Example Component A',
        consumer: 'Example Component B',
        channel: 'bazg.proto.declaration.events.v1',
        schema: 'declaration/DeclarationAmended.avsc',
        version: '1.2.0',
        description: 'Invalidates the previous risk decision and re-opens the risk case.',
      },
      {
        kind: 'command',
        name: 'RecalculateRisk',
        direction: 'inbound',
        producer: 'Risk Operations Console (external)',
        consumer: 'Example Component B',
        channel: 'bazg.proto.risk.commands.v1',
        schema: 'risk/RecalculateRisk.avsc',
        version: '1.0.0',
        description:
          'Manual re-evaluation requested by a risk analyst, for example after a rule set change.',
      },
      {
        kind: 'event',
        name: 'RiskAssessmentCompleted',
        direction: 'outbound',
        producer: 'Example Component B',
        consumer: 'Example Component A, Audit Trail Service (external)',
        channel: 'bazg.proto.risk.events.v1',
        schema: 'risk/RiskAssessmentCompleted.avsc',
        version: '1.4.0',
        description:
          'Final risk decision with score, band and the identifiers of the rules that fired.',
      },
      {
        kind: 'command',
        name: 'OrderInspection',
        direction: 'outbound',
        producer: 'Example Component B',
        consumer: 'Inspection Planning (external)',
        channel: 'bazg.proto.inspection.commands.v1',
        schema: 'inspection/OrderInspection.avsc',
        version: '2.1.0',
        description:
          'Requests a physical or documentary inspection for a consignment in the high risk band.',
      },
      {
        kind: 'event',
        name: 'RiskModelDeployed',
        direction: 'outbound',
        producer: 'Example Component B',
        consumer: 'Model Registry (external), Audit Trail Service (external)',
        channel: 'bazg.proto.risk.events.v1',
        schema: 'risk/RiskModelDeployed.avsc',
        version: '1.0.0',
        description:
          'A new scoring model version became active. Recorded so that every decision stays reproducible.',
      },
    ],
  },
  {
    systemId: 'example-system-b',
    componentId: 'example-component-c',
    generator: 'bazg-msgdoc 0.4.1',
    generatedAt: '2026-08-03 03:10 UTC',
    sourceRepo: 'git.example.admin.ch/bazg-proto/notification-gateway',
    revision: 'd52c118',
    messages: [
      {
        kind: 'event',
        name: 'NotificationRequested',
        direction: 'inbound',
        producer: 'Transit Status Service (Example System B)',
        consumer: 'Example Component C',
        channel: 'bazg.proto.notification.events.v1',
        schema: 'notification/NotificationRequested.avsc',
        version: '1.1.0',
        description: 'A subscriber-facing notification should be delivered on all opted-in channels.',
      },
      {
        kind: 'command',
        name: 'SendOperationalBroadcast',
        direction: 'inbound',
        producer: 'Operations Console (external)',
        consumer: 'Example Component C',
        channel: 'bazg.proto.notification.commands.v1',
        schema: 'notification/SendOperationalBroadcast.avsc',
        version: '1.0.0',
        description: 'Manually triggered broadcast, for example an unplanned border closure.',
      },
      {
        kind: 'event',
        name: 'NotificationDelivered',
        direction: 'outbound',
        producer: 'Example Component C',
        consumer: 'Audit Trail Service (external)',
        channel: 'bazg.proto.notification.events.v1',
        schema: 'notification/NotificationDelivered.avsc',
        version: '1.1.0',
        description: 'Per-channel delivery confirmation used for the delivery rate indicator.',
      },
      {
        kind: 'event',
        name: 'NotificationFailed',
        direction: 'outbound',
        producer: 'Example Component C',
        consumer: 'Operations Alerting (external)',
        channel: 'bazg.proto.notification.events.v1',
        schema: 'notification/NotificationFailed.avsc',
        version: '1.1.0',
        description: 'All delivery attempts on a channel were exhausted. Raises an operations alert.',
      },
    ],
  },
];

export function messagingCatalogue(
  systemId: string,
  componentId: string,
): MessagingCatalogueEntry {
  const entry = CATALOGUES.find(
    (c) => c.systemId === systemId && c.componentId === componentId,
  );
  if (!entry) {
    throw new Error(`No messaging catalogue for ${systemId}/${componentId}.`);
  }
  return entry;
}

/** Stable anchor for one catalogue row, e.g. `msg-declarationaccepted`. */
export function messageAnchor(name: string): string {
  return `msg-${name.toLowerCase()}`;
}

/** Deep link into a component's messaging catalogue row. */
export function messageHref(
  systemId: string,
  componentId: string,
  name: string,
): string {
  return `${componentPath(
    systemId,
    componentId,
  )}crosscutting-concerns/messaging-events-and-commands/#${messageAnchor(name)}`;
}
