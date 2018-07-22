using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SeikaCenter;
using System.IO;
using Microsoft.Extensions.CommandLineUtils;

namespace Voice
{
    class Program
    {
        static void Main(string[] args)
        {

            var command = new ReadCommand(args);


            /*

            double len = 0.0;

            Dictionary<string, decimal> effects = new Dictionary<string, decimal>()
            {
                {"speed", 0.90m },
                {"pitch", 1.30m }
            };
            Dictionary<string, decimal> emotions = new Dictionary<string, decimal>()
            {
                {"喜び", 1.00m }
            };
            */

            // 音声発声時
            //len = SeikaConnect.Instance().scc.Talk(2000, "あー嬉しーなー", "", effects, emotions);

            // 音声保存時
            //len = SeikaConnect.Instance().scc.Talk(2001, "あー嬉しいなー", @"test1.wav", effects, emotions);
        }
    }
}
