let connectionsMade = 0;
const MAX_CONNECTIONS_COUNT = 100;

const BUTTON_CLASS = ".artdeco-button__text";
const CONNECT = "Встановити контакт";
const SEND_NOW_TEXT_ARIA_LABEL = "[aria-label='Надіслати без примітки']";
const GOT_IT_TEXT_ARIA_LABEL = "[aria-label='Зрозуміло']";
const NEXT_TEXT_ARIA_LABEL = "[aria-label='Вперед']";
const MAX_CONNECTIONS_H2_ID = "#ip-fuse-limit-alert__header";
const REACHED_MAX_CONNECTIONS_TEXT = "Ви досягли тижневого ліміту запрошень";
const DISMISS_TEXT_ARIA_LABEL = "[aria-label='Пропустити']";

async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickNextPage(attempt = 1) {
  if (attempt > 100) return;

  const nextButton = document.querySelector(NEXT_TEXT_ARIA_LABEL);
  console.log(`Переходимо на наступну сторінку\nСпроба: ${attempt}/100`);
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
  const buttons = document.querySelectorAll(BUTTON_CLASS);

  for (let button of buttons) {
    if (button.innerText !== CONNECT) {
      continue;
    }

    button.click();
    await sleep();

    const sendNowButton = document.querySelector(SEND_NOW_TEXT_ARIA_LABEL);
    if (sendNowButton?.disabled) {
      const dismissButton = document.querySelector(DISMISS_TEXT_ARIA_LABEL);
      dismissButton.click();
    } else if (sendNowButton) {
      sendNowButton.click();
      connectionsMade++;
      await sleep();
    }

    const maxConnectionsH2 = document.querySelector(MAX_CONNECTIONS_H2_ID);
    if (maxConnectionsH2?.innerText?.includes(REACHED_MAX_CONNECTIONS_TEXT)) {
      console.log("Досягнуто тижневий ліміт запрошень!");
      return;
    }

    const gotItButton = document.querySelector(GOT_IT_TEXT_ARIA_LABEL);
    if (gotItButton) {
      gotItButton.click();
      await sleep();
    }

    if (connectionsMade >= MAX_CONNECTIONS_COUNT) {
      console.log(
        `Досягнуто максилальну кількість запрошень:`,
        MAX_CONNECTIONS_COUNT
      );
      return;
    }
  }

  scrollToBottom();
  clickNextPage();
}

clickConnectButtons();
