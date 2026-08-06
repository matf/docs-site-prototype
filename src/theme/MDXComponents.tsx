import MDXComponents from '@theme-original/MDXComponents';
import Arc42SectionNav from '@site/src/components/Arc42SectionNav';
import Diagram from '@site/src/components/Diagram';
import DocMix from '@site/src/components/DocMix';
import DocHeader from '@site/src/components/DocHeader';
import MessageDetail from '@site/src/components/MessageDetail';
import MessageRelated from '@site/src/components/MessageDetail/MessageRelated';
import MessagingCatalogue, {ComponentMessages, Msg} from '@site/src/components/MessagingCatalogue';
import PrototypeNotice from '@site/src/components/PrototypeNotice';
import RelatedDocs from '@site/src/components/RelatedDocs';
import StatusBadge from '@site/src/components/StatusBadge';
import {CardGrid, ComponentCard, SystemCard} from '@site/src/components/Cards';
import {CustomMeta, GeneratedMeta} from '@site/src/components/MetaPanel';
import {ContentLegend, StatsRow} from '@site/src/components/Overview';

/**
 * Documentation building blocks available in every MDX file without an import.
 *
 * This is what keeps the badges and metadata panels consistent: a page author
 * (or a generator) writes `<DocHeader … />`, never the markup behind it.
 */
export default {
  ...MDXComponents,
  Arc42SectionNav,
  CardGrid,
  ComponentCard,
  ContentLegend,
  CustomMeta,
  Diagram,
  DocHeader,
  DocMix,
  GeneratedMeta,
  ComponentMessages,
  MessageDetail,
  MessageRelated,
  MessagingCatalogue,
  Msg,
  PrototypeNotice,
  RelatedDocs,
  StatsRow,
  StatusBadge,
  SystemCard,
};
