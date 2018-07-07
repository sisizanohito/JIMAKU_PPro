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

            double len = 0.0;

            decimal volume = 1.0m;
            decimal speed = 0.9m;
            decimal pitch = 1.3m;
            decimal alpha = 0.0m;
            decimal intonation = 1.0m;
            Dictionary<string, decimal> emotions = new Dictionary<string, decimal>()
            {
                {"喜び", 0.60m }
            };




            // 音声発声時
            len = SeikaConnect.Instance().scc.Talk(2000, "あー嬉しいなー", "", volume, speed, pitch, alpha, intonation, emotions);

            // 音声保存時
            // len = scc.Talk(2000, "あー嬉しいなー", @"C:\Users\isiis\Desktop\test.wav", volume, speed, pitch, alpha, intonation, emotions);
        }
    }
}
