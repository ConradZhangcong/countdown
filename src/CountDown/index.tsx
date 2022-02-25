import { List, Button, message } from "antd";
import ClipboardJS from "clipboard";
import dayjs from "dayjs";

import { HolidayItem } from "./types";

import styles from "./index.module.css";

export const holidayList: HolidayItem[] = [
  { id: "1", name: "元旦", day: new Date("2022-01-01") },
  { id: "2", name: "春节", day: new Date("2022-01-31") },
  { id: "3", name: "清明节", day: new Date("2022-04-05") },
  { id: "4", name: "劳动节", day: new Date("2022-04-30") },
  { id: "5", name: "端午节", day: new Date("2022-06-03") },
  { id: "6", name: "中秋节", day: new Date("2022-09-10") },
  { id: "7", name: "国庆节", day: new Date("2022-10-01") },
  { id: "8", name: "元旦", day: new Date("2023-01-01") },
  { id: "9", name: "春节", day: new Date("2023-01-21") },
];

const DEFAULT_PREFIX =
  "【摸鱼办】提醒您：{今日日期}{招呼}，摸鱼人！工作再忙，一定不要忘记摸鱼哦！有事没事起身去茶水间，去厕所，去走廊走走，去找同事聊聊八卦别老在工位上坐着，钱是老板的,但命是自己的。";

const DEFAULT_SUFFIX =
  "上班是帮老板赚钱，摸鱼是赚老板的钱！你摸鱼我摸鱼，老板宝马变爱玛！小摸怡情，大摸伤钱！最后，祝愿天下所有摸鱼人，都能愉快的渡过每一天…";
// 一天的毫秒数
const ONE_DAY_SECOND = 24 * 60 * 60 * 1000;
// 周末开始为星期几
const DEFAULT_START_OF_WEEKEND = 6;

const CountDown = () => {
  const nowData = new Date();

  /** 今日之后的日期 */
  const currentHolidatList = holidayList.filter(
    (holiday) => holiday.day.getTime() - nowData.getTime() > 0
  );
  currentHolidatList.unshift({
    id: holidayList.length + 1 + "",
    name: "周末",
    // @ts-ignore
    day: new Date(dayjs().day(DEFAULT_START_OF_WEEKEND)),
  });

  /** 复制文字 */
  const handleCopy = () => {
    let text = "";
    text = DEFAULT_PREFIX.replace(
      /{今日日期}/,
      dayjs(nowData).format("MM月DD日")
    ).replace(/{招呼}/, getHourGreet());

    for (let item of currentHolidatList) {
      text += `\r\n距离【${item.name}】还有${getDayDistance(item.day)}天`;
    }

    text += `\r\n${DEFAULT_SUFFIX}`;

    const clipboard = new ClipboardJS(".btn", { text: () => text });
    clipboard.on("success", () => {
      message.success("复制到剪贴板");
      clipboard.destroy();
    });
    clipboard.on("error", (e) => {
      console.error("复制失败: ", e);
      message.success("复制失败");
      clipboard.destroy();
    });
  };

  /** 计算日期间隔 */
  const getDayDistance = (day: Date) => {
    const dis = day.getTime() - nowData.getTime();
    const disDay = Math.floor(dis / ONE_DAY_SECOND);
    return disDay;
  };

  /** 根据时间获取招呼语 */
  const getHourGreet = () => {
    const hour = dayjs().hour();
    let text = "";
    if (hour >= 3 && hour < 6) {
      text = "凌晨好";
    } else if (hour < 12) {
      text = "上午好";
    } else if (hour < 14) {
      text = "中午好";
    } else if (hour < 18) {
      text = "下午好";
    } else if (hour < 22) {
      text = "晚上好";
    } else {
      text = "深夜好";
    }
    return text;
  };

  return (
    <div className={styles["count-down-container"]}>
      <List bordered className={styles["count-down-list"]}>
        {currentHolidatList.map((item) => (
          <List.Item
            key={item.id}
            title={dayjs(item.day).format("YYYY年MM月DD日")}
          >
            距离【{item.name}】还有{" "}
            <span className="text-color-red">{getDayDistance(item.day)}</span>{" "}
            天
          </List.Item>
        ))}
        <List.Item>
          当前时间: {dayjs(nowData).format("YYYY年MM月DD日")}
        </List.Item>
        <List.Item className="pull-right">
          <Button
            size="small"
            type="primary"
            className="btn"
            onClick={handleCopy}
          >
            复制
          </Button>
        </List.Item>
      </List>
      <div className="note-card">
        2023年节假日时间仅供参考, 以年末国务院发布的官方消息为准
      </div>
    </div>
  );
};

export default CountDown;
