import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import {
  messageAnchor,
  messageHref,
  messagingCatalogue,
  type MessageEntry,
  type MessageKind,
} from '@site/src/data/messaging';
import styles from './styles.module.css';

const KIND_LABEL: Record<MessageKind, string> = {
  command: 'Command',
  event: 'Event',
};

function KindTag({kind}: {kind: MessageKind}): ReactNode {
  return <span className={clsx(styles.kind, styles[kind])}>{KIND_LABEL[kind]}</span>;
}

function DirectionTag({direction}: {direction: MessageEntry['direction']}): ReactNode {
  return (
    <span className={clsx(styles.direction, styles[direction])}>
      <span aria-hidden="true">{direction === 'inbound' ? '↓ ' : '↑ '}</span>
      {direction === 'inbound' ? 'Inbound' : 'Outbound'}
    </span>
  );
}

/**
 * One catalogue row.
 *
 * The row registers its own anchor with Docusaurus so that the deep links from
 * the runtime views are covered by the build's broken-anchor check — anchors
 * outside headings are invisible to it otherwise.
 */
function Row({message}: {message: MessageEntry}): ReactNode {
  const anchor = messageAnchor(message.name);
  useBrokenLinks().collectAnchor(anchor);
  return (
    <tr id={anchor} className={styles.row}>
      <th scope="row" className={styles.nameCell}>
        <code>{message.name}</code>
        <a
          className={styles.permalink}
          href={`#${anchor}`}
          aria-label={`Direct link to ${message.name}`}>
          #
        </a>
      </th>
      <td>
        <KindTag kind={message.kind} />
      </td>
      <td>
        <DirectionTag direction={message.direction} />
      </td>
      <td>{message.producer}</td>
      <td>{message.consumer}</td>
      <td>
        <code className={styles.channel}>{message.channel}</code>
      </td>
      <td>
        <code className={styles.schema}>{message.schema}</code>
        <span className={styles.version}>v{message.version}</span>
      </td>
      <td className={styles.description}>{message.description}</td>
    </tr>
  );
}

function Table({title, messages}: {title: string; messages: readonly MessageEntry[]}): ReactNode {
  if (messages.length === 0) {
    return null;
  }
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>
        {title} <span className={styles.count}>({messages.length})</span>
      </h3>
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Direction</th>
              <th scope="col">Producer</th>
              <th scope="col">Consumer</th>
              <th scope="col">Channel</th>
              <th scope="col">Schema / version</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <Row key={message.name} message={message} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Generated catalogue of the messages a component consumes and publishes.
 *
 * Commands and events are rendered as two separate tables so the difference is
 * visible at a glance, and every row carries a stable anchor so runtime views
 * can link directly to the message they are talking about.
 */
export default function MessagingCatalogue({
  system,
  component,
}: {
  system: string;
  component: string;
}): ReactNode {
  const catalogue = messagingCatalogue(system, component);
  const commands = catalogue.messages.filter((m) => m.kind === 'command');
  const events = catalogue.messages.filter((m) => m.kind === 'event');
  const inbound = catalogue.messages.filter((m) => m.direction === 'inbound').length;

  return (
    <div>
      <p className={styles.summary}>
        {catalogue.messages.length} messages — {commands.length} commands, {events.length} events;{' '}
        {inbound} inbound, {catalogue.messages.length - inbound} outbound. Extracted from the
        message contracts in <code>{catalogue.sourceRepo}</code> at revision{' '}
        <code>{catalogue.revision}</code>.
      </p>
      <Table title="Commands" messages={commands} />
      <Table title="Events" messages={events} />
    </div>
  );
}

/**
 * Inline reference to one catalogue entry, for use in prose and runtime steps:
 * `<Msg system="…" component="…" name="DeclarationAccepted" />`.
 */
export function Msg({
  system,
  component,
  name,
}: {
  system: string;
  component: string;
  name: string;
}): ReactNode {
  const catalogue = messagingCatalogue(system, component);
  const entry = catalogue.messages.find((m) => m.name === name);
  if (!entry) {
    throw new Error(
      `Message "${name}" is not in the catalogue of ${system}/${component}. Known: ${catalogue.messages
        .map((m) => m.name)
        .join(', ')}`,
    );
  }
  return (
    <Link
      className={clsx(styles.ref, styles[`ref_${entry.kind}`])}
      to={messageHref(system, component, name)}
      title={`${KIND_LABEL[entry.kind]} — ${entry.description}`}>
      <span className={styles.refKind} aria-hidden="true">
        {entry.kind === 'command' ? 'CMD' : 'EVT'}
      </span>
      <code>{name}</code>
    </Link>
  );
}
