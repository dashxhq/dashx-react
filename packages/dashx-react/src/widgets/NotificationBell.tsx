import { intlFormatDistance } from 'date-fns';

import { useInApp } from '../hooks/index.js';
import { Button, Card, Flex, Heading, Popover, Text, Theme, Tooltip } from '../index.js';
import { Inbox, Mail, MailOpen, X } from '../icons/index.js';

const NotificationBell = () => {
  let {
    markNotificationAsRead,
    markNotificationAsUnread,
    notifications,
    unreadNotificationsCount,
  } = useInApp();

  return (
    <Theme>
      <Popover.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Popover.Trigger>
              <Button
                shape="square"
                roundness="full"
                variant={unreadNotificationsCount ? 'fill' : 'ghost'}
              >
                <Inbox />
              </Button>
            </Popover.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Content content="Notification" />
        </Tooltip.Root>
        <Popover.Content spacing="large" width="350px" height="450px">
          <Popover.Header asChild>
            <Flex justify="between" align="center">
              <Heading size={3}>Notifications</Heading>
              <Popover.Close>
                <Button shape="square" roundness="full" variant="ghost" mode="subtle" inset="right">
                  <X />
                </Button>
              </Popover.Close>
            </Flex>
          </Popover.Header>
          <Popover.Body>
            <Flex direction="column" gap={1}>
              {notifications.length < 0 && (
                <Flex justify="center" align="center">
                  <Text variant="tertiary" size={2}>
                    No notifications yet.
                  </Text>
                </Flex>
              )}
              {notifications.map((notification) => (
                <Card key={notification.id}>
                  <Flex align="center" gap={4} justify="between">
                    <Flex direction="column" gap={1}>
                      <Text as="p" variant="secondary" weight="semibold" size={2}>
                        {notification.renderedContent.body}
                      </Text>
                      <Text size={1} variant="tertiary">
                        {intlFormatDistance(notification.sentAt, new Date())}
                      </Text>
                    </Flex>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        <Button
                          shape="square"
                          variant="ghost"
                          roundness="full"
                          mode={notification.readAt ? 'subtle' : 'distinct'}
                          onPress={() => {
                            if (notification.readAt) {
                              markNotificationAsUnread(notification.id);
                            } else {
                              markNotificationAsRead(notification.id);
                            }
                          }}
                        >
                          {notification.readAt ? <MailOpen /> : <Mail />}
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content
                        content={notification.readAt ? 'Mark as unread' : 'Mark as read'}
                      />
                    </Tooltip.Root>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Popover.Body>
          <Popover.Footer asChild>
            <Text as="p" align="center" color="accent" variant="tertiary" size={1}>
              Powered by DashX
            </Text>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Root>
    </Theme>
  );
};

export default NotificationBell;
