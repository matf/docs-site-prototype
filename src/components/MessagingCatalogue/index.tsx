import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@site/src/components/EnvLink';
import {
  messageByName,
  messagePath,
  messagesOfComponent,
  partiesOn,
  systemCatalogue,
  type MessageEntry,
  type MessageKind,
  type Party,
} from '@site/src/data/messaging';
import {useEnvironment} from '@site/src/data/environments';
import styles from './styles.module.css';

const KIND_LABEL: Record<MessageKind, string> = {
  command: 'Command',
  event: 'Event',
};

function KindTag({kind}: {kind: MessageKind}): ReactNode {
  return <span className={clsx(styles.kind, styles[kind])}>{KIND_LABEL[kind]}</span>;
}

function PartyList({parties}: {parties: readonly Party[]}): ReactNode {
  const environment = useEnvironment();
  return (
    <>
      {partiesOn(parties, environment.id).map((party, i) => (
        <React.Fragment key={party.label}>
          {i > 0 ? ', ' : ''}
          {party.label}
        </React.Fragment>
      ))}
    </>
  );
}

function Table({
  system,
  title,
  messages,
}: {
  system: string;
  title: string;
  messages: readonly MessageEntry[];
}): ReactNode {
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
              <th scope="col">Producer</th>
              <th scope="col">Consumers</th>
              <th scope="col">Channel</th>
              <th scope="col">Schema / version</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.name}>
                <th scope="row" className={styles.nameCell}>
                  <Link to={messagePath(system, message.name)}>
                    <code>{message.name}</code>
                  </Link>
                </th>
                <td>
                  <KindTag kind={message.kind} />
                </td>
                <td>{message.producer.label}</td>
                <td>
                  <PartyList parties={message.consumers} />
                </td>
                <td>
                  <code className={styles.channel}>{message.channel}</code>
                </td>
                <td>
                  <code className={styles.schema}>{message.schema}</code>
                  <span className={styles.version}>v{message.version}</span>
                </td>
                <td className={styles.description}>{message.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Generated catalogue of the events and commands defined by one system.
 *
 * Message contracts belong to the system, not to a single component: several
 * components produce and consume the same contract. Commands and events are
 * rendered as two tables so the difference is visible at a glance, and every
 * name links to that message's own page.
 */
export default function MessagingCatalogue({system}: {system: string}): ReactNode {
  const catalogue = systemCatalogue(system);
  const commands = catalogue.messages.filter((m) => m.kind === 'command');
  const events = catalogue.messages.filter((m) => m.kind === 'event');

  return (
    <div>
      <p className={styles.summary}>
        {catalogue.messages.length} contracts — {commands.length} commands and {events.length}{' '}
        events. Extracted from the contract definitions in <code>{catalogue.sourceRepo}</code> at
        revision <code>{catalogue.revision}</code>.
      </p>
      <Table system={system} title="Commands" messages={commands} />
      <Table system={system} title="Events" messages={events} />
    </div>
  );
}

/**
 * The subset of a system's catalogue that one component produces and consumes.
 * Used on component pages, which no longer own a catalogue of their own.
 */
export function ComponentMessages({
  system,
  component,
}: {
  system: string;
  component: string;
}): ReactNode {
  const environment = useEnvironment();
  const {produced, consumed} = messagesOfComponent(system, component, environment.id);
  return (
    <div>
      <Table system={system} title="Consumes" messages={consumed} />
      <Table system={system} title="Publishes" messages={produced} />
    </div>
  );
}

/**
 * Inline reference to one contract, for use in prose and runtime steps:
 * `<Msg system="example-system-a" name="DeclarationAccepted" />`.
 */
export function Msg({system, name}: {system: string; name: string}): ReactNode {
  const entry = messageByName(system, name);
  return (
    <Link
      className={clsx(styles.ref, styles[`ref_${entry.kind}`])}
      to={messagePath(system, name)}
      title={`${KIND_LABEL[entry.kind]} — ${entry.description}`}>
      <span className={styles.refKind} aria-hidden="true">
        {entry.kind === 'command' ? 'CMD' : 'EVT'}
      </span>
      <code>{name}</code>
    </Link>
  );
}
