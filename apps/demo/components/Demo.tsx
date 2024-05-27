import {
  Button,
  Card,
  CardMedia,
  Flex,
  Header,
  IconButton,
  Text,
} from '../../../packages/dashx-react/dist/cjs';

function Demo() {
  return (
    <div className="dx-ui mx-auto max-w-[480px]">
      <Card>
        <CardMedia>
          <img src="https://picsum.photos/200/265" alt="media" />
        </CardMedia>
        <Flex direction="column" gap={4}>
          <Header>Interesting Title</Header>
          <Text>
            This is an interesting description. It is something but nothing. This is a paragraph
          </Text>
          <hr />
          <Flex gap={4}>
            <Button>Button</Button>
            <IconButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                height="24"
                width="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </IconButton>
          </Flex>
          <Text size="sm">*Terms and conditions apply</Text>
        </Flex>
      </Card>
    </div>
  );
}

export default Demo;
