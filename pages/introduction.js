import {
    AppProvider,
    Card,
    Heading,
    List,
    Link,
    Page,
    TextContainer,
  } from "@shopify/polaris";
  
  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };
  const link = "/regform?shop=" + process.env.SHOP;
  console.log(link);
  const Index = () => (
    <AppProvider
      i18n={{
        Polaris: {
          ResourceList: {
            sortingLabel: "Sort by",
            defaultItemSingular: "item",
            defaultItemPlural: "items",
            showing: "Showing {itemsCount} {resource}",
            Item: {
              viewItem: "View details for {itemName}",
            },
          },
          Common: {
            checkbox: "checkbox",
          },
        },
      }}
    >
      <Page title="Integrate your Store with Tally.ERP9 / Tally Prime">
        <Card>
          <Card.Section>
            <Heading>Simplified E-Commerce Accounting</Heading>
            <p>
              Create Products, Manage Customers, Track Orders, Keep Accutate
              Records, Easy Statutory Compliances
            </p>
          </Card.Section>
          <Card.Section title="Features">
            <List type="number">
              <List.Item>Scope of Duplication : 0</List.Item>
              <List.Item>need to Import / Export Data : 0</List.Item>
              <List.Item>
                Fully Automated Synchronisation of Orders & Tracking Status
              </List.Item>
              <List.Item>
                Create Stock Item / Group in Tally.ERP9 / Tally Prime with Images
                and post them as Single / Multi Variant Products on Shopify
              </List.Item>
              <List.Item>
                Receive Orders in Tally.ERP9 / Tally Prime as soon as they are
                booked on Shopify
              </List.Item>
              <List.Item>
                Material dispatch entry is booked in Tally.ERP9 / Tally Prime
                along with courier details once the Material is Dispatched
              </List.Item>
              <List.Item>
                keep track of material with the link provided in the Tally.ERP9 /
                Tally Prime interface
              </List.Item>
              <List.Item>
                Sales Entry is booked with necessary adjustment entry for COD
                Partner / Payment Gateway.
              </List.Item>
              <List.Item>
                Easy reconciliation with COD Partner / Payment Gateway
              </List.Item>
              <List.Item>
                In case Material is returned undelivered / post delivery,
                Automated rejection note is duly processed
              </List.Item>
              <List.Item>
                Autmoated Reversal is done for COD partner / Payment Gateway
              </List.Item>
            </List>
          </Card.Section>
          <Card.Section>
            <TextContainer>
              <a>
                This app requires additional setup and a TCP file compiled on your
                Tally Serial Number, Please fill up the{" "}
              </a>
              <Link url={link}>Registration Form.</Link>
            </TextContainer>
          </Card.Section>
        </Card>
      </Page>
    </AppProvider>
  );
  
  export default Index;
  