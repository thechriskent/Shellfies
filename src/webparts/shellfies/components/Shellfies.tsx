import * as React from 'react';
import styles from './Shellfies.module.scss';
import type { IShellfiesProps } from './IShellfiesProps';
import { WebPartTitle } from '@pnp/spfx-controls-react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { Egg } from './Egg';

export interface IEgg {
  imageSrc: string;
  name: string;
}

export const Shellfies = (props: IShellfiesProps): JSX.Element => {
  const {
    title,
    hasTeamsContext,
    displayMode,
    updateTitle,
    sp,
    listId,
    columnName,
    limit,
  } = props;

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [eggs, setEggs] = React.useState<IEgg[]>([]);

  React.useEffect(() => {
    const getEggs = async (): Promise<void> => {
      if(listId && columnName) {
        const items = await sp.web.lists.getById(listId).items.select(`${columnName}/Title,${columnName}/EMail`).top(limit).expand(columnName)();
        setEggs(items.map((item) => ({
          imageSrc: `/_layouts/15/userphoto.aspx?size=L&username=${item[columnName].EMail}`,
          name: item[columnName].Title,
        }))
        );
        setIsLoaded(true);
      }
    };
    getEggs().catch((error) => {
      console.error('Error fetching eggs:', error);
    });
  }, [listId, columnName, limit, sp]);

  return (
    <section className={`${styles.shellfies} ${hasTeamsContext ? styles.teams : ''}`}>
      <WebPartTitle title={title} updateProperty={updateTitle} displayMode={displayMode} />
      {!isLoaded &&
        <Spinner size={SpinnerSize.large} label="loading..." />
      }
      {isLoaded &&
        <div>
          {eggs.map((egg, index) => (
            <div key={index}>
              <Egg imgSrc={egg.imageSrc} key={index} />
            </div>
          ))}
        </div>
      }
    </section>
  );
}