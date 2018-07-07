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

        }
        private void SetHelp()
        {
            // ヘルプ出力のトリガーとなるオプションを指定
            app.HelpOption("-?|-h|--help");

            
        }
        
    }
}
