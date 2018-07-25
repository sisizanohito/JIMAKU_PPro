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
        }
    }
}
