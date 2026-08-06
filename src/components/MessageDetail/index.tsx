import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import {componentPath, systemById} from '@site/src/data/catalog';
import {messageByName, type Party} from '@site/src/data/messaging';
import styles from './styles.module.css';

function PartyLink({system, party}: {system: string; party: Party}): ReactNode {
  if (!party.component) {
    return <span>{party.label}</span>;
  }
  return <Link to={componentPath(system, party.component)}>{party.label}</Link>;
}

/**
 * Everything the generator knows about one event or command.
 *
 * Kept as a component rather than as markup repeated on fifteen pages: a
 * message page is pure generated output, so its shape must be identical
 * everywhere and changing it must be a one-line change.
 */
export default function MessageDetail({
  system,
  name,
}: {
  system: string;
  name: string;
}): ReactNode {
  const message = messageByName(system, name);
  const systemEntry = systemById(system);

  return (
    <>
      <p className={styles.lead}>{message.description}</p>

      <dl className={styles.props}>
        {[
          {label: 'Type', value: message.kind === 'command' ? 'Command' : 'Event'},
          {
            label: 'Producer',
            value: <PartyLink system={system} party={message.producer} />,
          },
          {
            label: 'Consumers',
            value: message.consumers.map((party, i) => (
              <React.Fragment key={party.label}>
                {i > 0 ? ', ' : ''}
                <PartyLink system={system} party={party} />
              </React.Fragment>
            )),
          },
          {label: 'Channel', value: <code>{message.channel}</code>},
          {label: 'Schema', value: <code>{message.schema}</code>},
          {label: 'Version', value: <code>v{message.version}</code>},
          {label: 'Ordering key', value: <code>{message.partitionKey}</code>},
          {label: 'Retention', value: message.retention},
          {label: 'Defined by', value: systemEntry.name},
        ].map((row) => (
          <div className={styles.prop} key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      <h2>Payload</h2>
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Type</th>
              <th scope="col">Required</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {message.fields.map((field) => (
              <tr key={field.name}>
                <th scope="row">
                  <code>{field.name}</code>
                </th>
                <td>
                  <code>{field.type}</code>
                </td>
                <td>
                  <span className={clsx(styles.flag, field.required && styles.required)}>
                    {field.required ? 'yes' : 'no'}
                  </span>
                </td>
                <td>{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.envelopeNote}>
        Every message additionally carries the standard envelope — <code>messageId</code>,{' '}
        <code>correlationId</code>, <code>causationId</code>, <code>occurredAt</code> and{' '}
        <code>schemaVersion</code>.
      </p>

      <h2>Example</h2>
      <CodeBlock language="json">{message.example}</CodeBlock>

      {message.history ? (
        <>
          <h2>Version history</h2>
          <div className={styles.scroller}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Version</th>
                  <th scope="col">Change</th>
                  <th scope="col">Compatibility</th>
                </tr>
              </thead>
              <tbody>
                {message.history.map((entry) => (
                  <tr key={entry.version}>
                    <th scope="row">
                      <code>v{entry.version}</code>
                    </th>
                    <td>{entry.change}</td>
                    <td>{entry.compatibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </>
  );
}
