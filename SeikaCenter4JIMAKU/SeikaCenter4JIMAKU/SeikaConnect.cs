using SeikaCenter;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace Voice
{
    class  SeikaConnect
    {
        private static SeikaConnect _instance = new SeikaConnect();
        public SeikaCenterControl scc;
        public static SeikaConnect Instance()
        {
            return _instance;
        }

        private SeikaConnect()
        {
            scc = new SeikaCenterControl();
        }

        /// <summary>
        /// 任意のオブジェクトを JSON メッセージへシリアライズします。
        /// </summary>
        public static string Serialize(object graph)
        {
            using (var stream = new MemoryStream())
            {
                var serializer = new DataContractJsonSerializer(graph.GetType());
                serializer.WriteObject(stream, graph);
                return Encoding.UTF8.GetString(stream.ToArray());
            }
        }
    }
}
