import { list } from '@keystone-next/keystone/schema';
import { text, select, timestamp, relationship, checkbox, integer } from '@keystone-next/fields';
import { DateTime } from 'luxon';

export const Event = list({
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    price: integer(),
    time: timestamp({ isRequired: true }), // Startzeit des Events
    format: select({
      isRequired: true,
      options: [
        { label: 'Standard', value: 'Standard' },
        { label: 'Pauper', value: 'Pauper' },
        { label: 'Modern', value: 'Modern' },
        { label: 'Pioneer', value: 'Pioneer' },
        { label: 'Legacy', value: 'Legacy' },
        { label: 'Vintage', value: 'Vintage' },
        { label: 'Commander', value: 'Commander' },
        { label: 'Highlander', value: 'Highlander' },
        { label: 'Sealed', value: 'Sealed' },
        { label: 'Draft', value: 'Draft' },
      ],
    }),
    store: relationship({ ref: 'Store.events' }),
    repeatWeekly: checkbox({ defaultValue: false }), // Checkbox für Wiederholung
    repeatUntil: timestamp({
      isRequired: false,
      hooks: {
        validateInput: ({ resolvedData, addValidationError }) => {
          if (resolvedData.repeatWeekly && !resolvedData.repeatUntil) {
            addValidationError('Das Wiederholungs-Enddatum (repeatUntil) ist erforderlich, wenn die wöchentliche Wiederholung aktiviert ist.');
          }
          if (resolvedData.time && resolvedData.repeatUntil) {
            const startTime = DateTime.fromISO(resolvedData.time);
            const maxEndDate = startTime.plus({ months: 6 });
            const repeatUntil = DateTime.fromISO(resolvedData.repeatUntil);
            if (repeatUntil > maxEndDate) {
              addValidationError('Das Enddatum der Wiederholung darf maximal 6 Monate nach dem Startdatum liegen.');
            }
          }
        },
      },
    }),
    participants: relationship({
        ref: 'User.events',
        many: true,
    })
  },
  hooks: {
    resolveInput: async ({ resolvedData, context }) => {
      // Setzt `repeatUntil` auf 6 Monate nach `time`, falls `repeatWeekly` true ist und `repeatUntil` nicht gesetzt wurde
      if (resolvedData.repeatWeekly && resolvedData.time && !resolvedData.repeatUntil) {
        const startTime = DateTime.fromISO(resolvedData.time);
        resolvedData.repeatUntil = startTime.plus({ months: 6 }).toISO();
      }

      // Überprüfung und Erstellung der wöchentlichen Events, wenn `repeatWeekly` aktiviert ist
      if (resolvedData.repeatWeekly && resolvedData.time && resolvedData.repeatUntil) {
        const startTime = DateTime.fromISO(resolvedData.time);
        const endTime = DateTime.fromISO(resolvedData.repeatUntil);
        const storeId = resolvedData.store;
        const eventsToCreate = [];

        let currentTime = startTime.plus({ weeks: 1 });
        while (currentTime <= endTime) {
          if (storeId) {
            const existingEvent = await context.lists.Event.findMany({
              where: {
                store: { id: storeId },
                time: currentTime.toISO(),
              },
            });

            if (existingEvent.length === 0) {
              eventsToCreate.push({
                data: {
                  name: resolvedData.name,
                  description: resolvedData.description,
                  time: currentTime.toISO(),
                  format: resolvedData.format,
                  store: { connect: { id: storeId } },
                },
              });
            } else {
              console.log(`Event-Duplikat gefunden für ${currentTime.toISO()} im Store ${storeId}. Überspringe die Erstellung.`);
            }
          }

          currentTime = currentTime.plus({ weeks: 1 });
        }

        if (eventsToCreate.length > 0) {
          await context.lists.Event.createMany({
            data: eventsToCreate,
          });
        }
      }

      return resolvedData;
    },
  },
});
