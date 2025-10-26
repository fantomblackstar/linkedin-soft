let connectionsMade = 0;
const MAX_CONNECTIONS_COUNT = 100;

const CONNECT_BUTTON_SELECTOR = "button[aria-label*='to connect']";
const NEXT_BUTTON_SELECTOR =
  "button[data-testid='pagination-controls-next-button-visible']";
const MAX_CONNECTIONS_ALERT_SELECTOR = "div[role='alert']";

async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickNextPage(attempt = 1) {
  if (attempt > 100) return;

  const nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
  console.log(`Going to the next page\nAttempt: ${attempt}/100`);
  if (nextButton) {
    nextButton.click();
    await sleep(5000);
    clickConnectButtons();
  } else {
    await sleep(3000);
    clickNextPage(attempt + 1);
  }
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

async function clickConnectButtons() {
  const buttons = document.querySelectorAll(CONNECT_BUTTON_SELECTOR);

  for (let button of buttons) {
    button.click();
    await sleep();

    const maxConnectionsAlert = document.querySelector(
      MAX_CONNECTIONS_ALERT_SELECTOR
    );

    if (maxConnectionsAlert) {
      console.log("Reached the weekly invitations limit!");
      return;
    }

    connectionsMade++;
    if (connectionsMade >= MAX_CONNECTIONS_COUNT) {
      console.log(`Reached the max invitations count:`, MAX_CONNECTIONS_COUNT);
      return;
    }
  }

  scrollToBottom();
  clickNextPage();
}

clickConnectButtons();
