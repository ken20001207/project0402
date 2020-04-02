import React from "react";
import "./App.css";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

interface AppProps {}

interface AppStates {
    data: Array<game>;
    no: number;
    from: number;
    to: number;
    fromdate: number;
    todate: number;
    description: JSX.Element[];
}

interface game {
    date: number;
    id: number;
    result: Array<number>;
}

function toArray(lines: Array<string>) {
    return new Promise<Array<game>>(resolve => {
        try {
            var datas = new Array<game>();
            lines.forEach(line => {
                if (line[0] !== ",") {
                    var game: game = { id: 0, result: [], date: 0 };
                    var date = line.split(",")[0];
                    if (date.includes("/")) {
                        if (+date.split("/")[1] < 9) date = date.split("/")[0] + "/0" + date.split("/")[1] + "/" + date.split("/")[2];
                        if (+date.split("/")[2] < 9) date = date.split("/")[0] + "/" + date.split("/")[1] + "/0" + date.split("/")[2];
                        game.date = +date.replace("/", "").replace("/", "");
                    } else {
                        game.date = +date.replace("-", "").replace("-", "");
                    }
                    game.id = +line.split(",")[1];
                    for (var i = 0; i < 10; i++) {
                        game.result.push(+line.split(",")[2 + i]);
                    }
                    if (game.id > 0) datas.push(game);
                }
            });
            resolve(datas);
        } catch (err) {
            alert("輸入的檔案格式有問題!");
        }
    });
}

class App extends React.Component<AppProps, AppStates> {
    constructor(props: Readonly<AppProps>) {
        super(props);
        this.state = {
            no: 1,
            data: [],
            from: 0,
            to: 1,
            fromdate: 0,
            todate: 0,
            description: []
        };
    }

    fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = async e => {
            if (e.target === null) return;
            const text = e.target.result as string;
            var data = await toArray(text.split("\n"));
            this.setState({ data: data, fromdate: data[data.length - 1].date, todate: data[0].date, from: data[data.length - 1].id, to: data[0].id });
        };
        if (e.target.files === null) return;
        reader.readAsText(e.target.files[0]);
    };

    noChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            no: +e.target.value
        });
    };

    fromChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            from: +e.target.value
        });
    };

    toChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            to: +e.target.value
        });
    };

    fromdateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            fromdate: +e.target.value
        });
    };

    todateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            todate: +e.target.value
        });
    };

    handlechartClick = (data: number, index: number) => {
        var gamesid = [<p>{index + 1 + " 號在以下場次獲得第 " + this.state.no + " 名："}</p>];
        this.state.data.forEach(data => {
            if (
                (data.date > this.state.fromdate && data.date < this.state.todate) ||
                ((data.date === this.state.todate || data.date === this.state.fromdate) && data.id >= this.state.from && data.id <= this.state.to)
            ) {
                if (data.result[this.state.no - 1] === index + 1) gamesid.push(<p>{data.date + "第" + data.id + "場"}</p>);
            }
        });
        gamesid[0] = <p>{index + 1 + " 號在以下場次獲得第 " + this.state.no + " 名 (共" + (gamesid.length - 1) + "場）："}</p>;
        this.setState({
            description: gamesid
        });
    };

    render() {
        const nos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var displaydata: Array<{ id: number; value: number }> = [
            { id: 1, value: 0 },
            { id: 2, value: 0 },
            { id: 3, value: 0 },
            { id: 4, value: 0 },
            { id: 5, value: 0 },
            { id: 6, value: 0 },
            { id: 7, value: 0 },
            { id: 8, value: 0 },
            { id: 9, value: 0 },
            { id: 10, value: 0 }
        ];
        this.state.data.forEach(data => {
            if (
                (data.date > this.state.fromdate && data.date < this.state.todate) ||
                ((data.date === this.state.todate || data.date === this.state.fromdate) && data.id >= this.state.from && data.id <= this.state.to)
            ) {
                displaydata[data.result[this.state.no - 1] - 1].value++;
            }
        });
        displaydata.sort((dataA, dataB) => {
            return dataB.value - dataA.value;
        });
        return (
            <div>
                <input type="file" onChange={e => this.fileChangeHandler(e)} />
                <div>
                    <p style={{ display: "inline-block" }}>統計獲得第</p>
                    <select onChange={e => this.noChangeHandler(e)}>
                        {nos.map(no => {
                            return <option value={no}>{no}</option>;
                        })}
                    </select>
                    <p style={{ display: "inline-block" }}>名的次數</p>
                </div>
                <div>
                    <p style={{ display: "inline-block" }}>統計範圍：從</p>
                    <input style={{ display: "inline-block" }} onChange={e => this.fromdateChangeHandler(e)} value={this.state.fromdate} />
                    <p style={{ display: "inline-block" }}>號的第</p>
                    <input style={{ display: "inline-block" }} onChange={e => this.fromChangeHandler(e)} value={this.state.from} />
                    <p style={{ display: "inline-block" }}>場到</p>
                    <p style={{ display: "inline-block" }}>號的第</p>
                    <input style={{ display: "inline-block" }} onChange={e => this.todateChangeHandler(e)} value={this.state.todate} />
                    <input style={{ display: "inline-block" }} onChange={e => this.toChangeHandler(e)} value={this.state.to} />
                    <p style={{ display: "inline-block" }}>場</p>
                </div>

                <BarChart
                    width={800}
                    height={400}
                    data={displaydata}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                    stackOffset="sign"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" onClick={this.handlechartClick} label={{ position: "top" }} />
                </BarChart>

                <p>{this.state.description}</p>
            </div>
        );
    }
}

export default App;
