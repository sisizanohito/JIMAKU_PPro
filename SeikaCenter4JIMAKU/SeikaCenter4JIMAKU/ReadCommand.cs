using Microsoft.Extensions.CommandLineUtils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Voice
{
    class ReadCommand
    {
        CommandLineApplication app = new CommandLineApplication(throwOnUnexpectedArg: false)
        {
            // アプリケーション名（ヘルプの出力で使用される）
            Name = "Voice",
        };
        
        public ReadCommand(string[] args)
        {
            Init();
            app.Execute(args);
        }

        private void Init()
        {
            app.OnExecute(() =>
            {
                Console.WriteLine("Hello World!");
                return 0;
            });
            SetHelp();
            SetReturnJSON();

        }
        private void SetHelp()
        {
            // ヘルプ出力のトリガーとなるオプションを指定
            app.HelpOption("-?|-h|--help");
        }
        private void SetReturnJSON()
        {
            app.Command("get", (command) =>
            {
                // 説明（ヘルプの出力で使用される）
                command.Description = "SeikaCenterの情報を返す";

                // コマンドについてのヘルプ出力のトリガーとなるオプションを指定
                command.HelpOption("-?|-h|--help");


                command.OnExecute(() =>
                {
                    SeikaData seikaData = new SeikaData();
                    string json = SeikaConnect.Serialize(seikaData);
                    Console.WriteLine(json);
                    return 0;
                });
            });
        }
        
    }
}
