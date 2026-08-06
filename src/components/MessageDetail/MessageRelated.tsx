import React, {type ReactNode} from 'react';
import {componentById, componentPath, sectionPath} from '@site/src/data/catalog';
import {messageByName} from '@site/src/data/messaging';
import {useDocsStatus} from '@site/src/data/useDocsStatus';
import RelatedDocs, {type RelatedDocItem} from '@site/src/components/RelatedDocs';

/**
 * Cross-links for one message page, derived from the contract itself.
 *
 * A message is the seam between components, so its page is the natural place to
 * jump to whichever component produces it, whichever components consume it and
 * the runtime views where it appears. Building the list from data means a new
 * contract arrives with working links instead of a to-do.
 */
export default function MessageRelated({
  system,
  name,
}: {
  system: string;
  name: string;
}): ReactNode {
  const message = messageByName(system, name);
  const {exists, statusOf} = useDocsStatus();

  const parties = [message.producer, ...message.consumers].filter((p) => p.component);
  const seen = new Set<string>();

  const items: RelatedDocItem[] = [];
  for (const party of parties) {
    const componentId = party.component!;
    if (seen.has(componentId)) {
      continue;
    }
    seen.add(componentId);
    const entry = componentById(system, componentId);
    const runtime = sectionPath(system, componentId, 'system-architecture', 'runtime-view');
    const role = message.producer.component === componentId ? 'Publishes' : 'Consumes';
    if (exists(runtime)) {
      items.push({
        to: runtime,
        label: `${entry.name} — 6. Runtime View`,
        note: `${role} this ${message.kind}.`,
        status: statusOf(runtime),
      });
    } else {
      items.push({
        to: componentPath(system, componentId),
        label: entry.name,
        note: `${role} this ${message.kind}.`,
        status: statusOf(componentPath(system, componentId)),
      });
    }
  }

  const buildingBlockView = sectionPath(system, undefined, 'system-architecture', 'building-block-view');
  items.push({
    to: buildingBlockView,
    label: '5. Building Block View',
    note: 'The full contract catalogue of this system.',
    status: statusOf(buildingBlockView),
  });

  const conventions =
    '/systems/example-system-a/components/example-component-a/system-architecture/crosscutting-concerns/integration-conventions/';
  if (exists(conventions)) {
    items.push({
      to: conventions,
      label: 'Integration Conventions',
      note: 'Envelope, idempotency and versioning rules that apply to every contract.',
      status: statusOf(conventions),
    });
  }

  return <RelatedDocs items={items} />;
}
